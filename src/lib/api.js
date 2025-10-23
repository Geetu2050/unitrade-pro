import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})
