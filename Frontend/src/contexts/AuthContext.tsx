import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authApi, userApi, type AuthResponse, type User } from '../lib/api'

interface AuthState {
  user: User | null
  apiKey: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  setApiKeyManually: (key: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    apiKey: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const storedKey = localStorage.getItem('devai_api_key')
    if (storedKey) {
      userApi.getMe()
        .then((user) => {
          setState({ user, apiKey: storedKey, isAuthenticated: true, isLoading: false })
        })
        .catch(() => {
          localStorage.removeItem('devai_api_key')
          setState({ user: null, apiKey: null, isAuthenticated: false, isLoading: false })
        })
    } else {
      setState((s) => ({ ...s, isLoading: false }))
    }
  }, [])

  function applyAuth(res: AuthResponse) {
    localStorage.setItem('devai_api_key', res.apiKey)
    const user: User = {
      _id: res._id,
      name: res.name,
      email: res.email,
      role: res.role,
      subscriptionPlan: res.subscriptionPlan as User['subscriptionPlan'],
      credits: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setState({ user, apiKey: res.apiKey, isAuthenticated: true, isLoading: false })
  }

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    applyAuth(res)
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password)
    applyAuth(res)
  }

  const loginWithGoogle = async (credential: string) => {
    const res = await authApi.google(credential)
    applyAuth(res)
  }

  const refreshUser = async () => {
    const user = await userApi.getMe()
    setState((s) => ({ ...s, user, isAuthenticated: true, isLoading: false }))
  }

  const logout = () => {
    localStorage.removeItem('devai_api_key')
    setState({ user: null, apiKey: null, isAuthenticated: false, isLoading: false })
  }

  const setApiKeyManually = async (key: string) => {
    localStorage.setItem('devai_api_key', key)
    try {
      const user = await userApi.getMe()
      setState({ user, apiKey: key, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('devai_api_key')
      throw new Error('Invalid API key')
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginWithGoogle, logout, refreshUser, setApiKeyManually }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
