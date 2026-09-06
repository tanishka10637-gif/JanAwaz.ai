import React, { useState } from 'react'
import './login.css'

const Signup = ({ onLogin, onSubmit }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await onSubmit({ username, email, password })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='login'>
      <section className='form-box' aria-labelledby='signup-title'>
        <h2 id='signup-title'>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='signup-username'>Username</label>
            <input type='text' id='signup-username' name='username' value={username} onChange={(event) => setUsername(event.target.value)} placeholder='Enter your username' autoComplete='username' required />
          </div>
          <div className='form-group'>
            <label htmlFor='signup-email'>Email</label>
            <input type='email' id='signup-email' name='email' value={email} onChange={(event) => setEmail(event.target.value)} placeholder='Enter your email' autoComplete='email' required />
          </div>
          <div className='form-group'>
            <label htmlFor='signup-password'>Password</label>
            <input type='password' id='signup-password' name='password' value={password} onChange={(event) => setPassword(event.target.value)} placeholder='At least 8 characters' autoComplete='new-password' minLength='8' required />
          </div>
          <button type='submit' className='btn btn-primary' disabled={isLoading}>{isLoading ? 'Creating account...' : 'Sign Up'}</button>
        </form>
        {error && <p className='form-error' role='alert'>{error}</p>}
        <p className='form-switch'>Already have an account? <button type='button' onClick={onLogin}>Login</button></p>
      </section>
    </main>
  )
}

export default Signup