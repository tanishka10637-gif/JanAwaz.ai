import React, { useState } from 'react'
import './login.css'
const Login = ({ onSignup, onSubmit }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await onSubmit({ email, password })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='login'>
      <section className='form-box' aria-labelledby='login-title'>
        <h2 id='login-title'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>Email Address</label>
            <input type='email' id='username' name='username' value={email} onChange={(event) => setEmail(event.target.value)} placeholder='you@example.com' autoComplete='email' required />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password' value={password} onChange={(event) => setPassword(event.target.value)} placeholder='Enter your password' autoComplete='current-password' required />
          </div>
          <button type='submit' className='btn btn-primary' disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
        </form>
        {error && <p className='form-error' role='alert'>{error}</p>}

        <div className='login-divider' aria-hidden='true'>
          <span></span>
          <span>or</span>
          <span></span>
        </div>
        <p className='form-switch'>Don't have an account? <button type='button' onClick={onSignup}>Sign up</button></p>
      </section>
    </main>
  )
}

export default Login