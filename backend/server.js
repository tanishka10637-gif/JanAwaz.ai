import 'dotenv/config'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import pg from 'pg'

const { Pool } = pg
const app = express()
const port = Number(process.env.PORT) || 5000
const databaseUrl = process.env.DATABASE_URL?.trim()
const databaseConfig = databaseUrl ? {
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
} : null
const pool = databaseConfig ? new Pool(databaseConfig) : null
const jwtSecret = process.env.JWT_SECRET || 'janawaz-development-secret'

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }))
app.use(express.json())

const ensureDatabase = async () => {
  if (!pool) return
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

const createToken = (user) => jwt.sign({ id: user.id, username: user.username, email: user.email }, jwtSecret, { expiresIn: '7d' })

app.get('/', (_request, response) => {
  response.json({
    name: 'JanAwaz API',
    status: 'running',
    health: '/api/health',
    complaints: '/api/complaints'
  })
})

app.get('/api/health', async (_request, response) => {
  if (!pool) {
    return response.json({ ok: true, database: 'not configured' })
  }

  try {
    await pool.query('SELECT 1')
    return response.json({ ok: true, database: 'connected' })
  } catch (_error) {
    return response.status(503).json({ ok: false, database: 'unavailable' })
  }
})

app.post('/api/auth/signup', async (request, response) => {
  const { username, email, password } = request.body
  if (!username?.trim() || !email?.trim() || !password || password.length < 8) {
    return response.status(400).json({ error: 'Username, email, and a password of at least 8 characters are required' })
  }
  if (!pool) return response.status(503).json({ error: 'Database is not configured' })

  try {
    const normalizedEmail = email.trim().toLowerCase()
    const passwordHash = await bcrypt.hash(password, 12)
    const result = await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email', [username.trim(), normalizedEmail, passwordHash])
    const user = result.rows[0]
    return response.status(201).json({ user, token: createToken(user) })
  } catch (error) {
    if (error.code === '23505') return response.status(409).json({ error: 'An account with this email already exists' })
    return response.status(500).json({ error: 'Unable to create account' })
  }
})

app.post('/api/auth/login', async (request, response) => {
  const { email, password } = request.body
  if (!email?.trim() || !password) return response.status(400).json({ error: 'Email and password are required' })
  if (!pool) return response.status(503).json({ error: 'Database is not configured' })

  try {
    const result = await pool.query('SELECT id, username, email, password_hash FROM users WHERE email = $1', [email.trim().toLowerCase()])
    const user = result.rows[0]
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return response.status(401).json({ error: 'Invalid email or password' })
    const safeUser = { id: user.id, username: user.username, email: user.email }
    return response.json({ user: safeUser, token: createToken(safeUser) })
  } catch (_error) {
    return response.status(500).json({ error: 'Unable to log in' })
  }
})

app.get('/api/auth/me', async (request, response) => {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (!token) return response.status(401).json({ error: 'Authentication required' })

  try {
    const payload = jwt.verify(token, jwtSecret)
    const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [payload.id])
    if (!result.rows[0]) return response.status(401).json({ error: 'Account no longer exists' })
    return response.json({ user: result.rows[0] })
  } catch (_error) {
    return response.status(401).json({ error: 'Session expired' })
  }
})

app.patch('/api/auth/me', async (request, response) => {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (!token) return response.status(401).json({ error: 'Authentication required' })
  const { username, email } = request.body
  if (!username?.trim() || !email?.trim()) return response.status(400).json({ error: 'Username and email are required' })

  try {
    const payload = jwt.verify(token, jwtSecret)
    const result = await pool.query('UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email', [username.trim(), email.trim().toLowerCase(), payload.id])
    if (!result.rows[0]) return response.status(404).json({ error: 'Account not found' })
    return response.json({ user: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') return response.status(409).json({ error: 'That email is already in use' })
    return response.status(401).json({ error: 'Unable to update account' })
  }
})

app.get('/api/complaints', async (_request, response) => {
  if (!pool) {
    return response.json([])
  }

  try {
    const result = await pool.query('SELECT * FROM complaints ORDER BY created_at DESC')
    return response.json(result.rows)
  } catch (_error) {
    return response.status(500).json({ error: 'Unable to load complaints' })
  }
})

ensureDatabase().then(() => {
  app.listen(port, () => console.log(`JanAwaz backend running at http://localhost:${port}`))
}).catch((error) => {
  console.error('Database initialization failed:', error.message)
  process.exit(1)
})
