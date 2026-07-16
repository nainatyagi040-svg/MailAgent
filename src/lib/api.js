import { supabase } from './supabase'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export async function fetchWithAuth(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  })

  // Optionally handle global 401s here
  // if (response.status === 401) { ... }

  return response
}
