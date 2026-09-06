const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

const request = async (path, options) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const signup = (credentials) => request('/api/auth/signup', {
  method: 'POST',
  body: JSON.stringify(credentials)
})

export const login = (credentials) => request('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
})

export const getCurrentUser = (token) => request('/api/auth/me', {
  headers: { Authorization: `Bearer ${token}` }
})

export const updateCurrentUser = (token, profile) => request('/api/auth/me', {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify(profile)
})
