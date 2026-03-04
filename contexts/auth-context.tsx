"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { API_BASE } from "@/lib/api"

export interface User {
  userId: number
  username: string
  name: string
  partner_name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, name: string, partnerName: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch profile with token
  const fetchProfile = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${accessToken}`, "Cache-Control": 'no-cache' },
        cache: 'no-store',
      })
      if (!res.ok) {
        throw new Error("Token inválido")
      }
      const profile = await res.json()
      setUser(profile)
      return true
    } catch {
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
      return false
    }
  }, [])

  // Hydrate from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchProfile(storedToken).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [fetchProfile])

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Credenciales inválidas")
      }
      const { access_token } = await res.json()
      localStorage.setItem("token", access_token)
      setToken(access_token)
      await fetchProfile(access_token)
      setLoading(false)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
      setLoading(false)
      return false
    }
  }

  const register = async (username: string, password: string, name: string, partnerName: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, partner_name: partnerName }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Error al registrarse")
      }
      setLoading(false)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse")
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
