import React, { createContext, useContext, useEffect, useState } from "react"

type User = { email: string }
type AuthCtx = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
const Ctx = createContext<AuthCtx | null>(null)

const DUMMY_USER = {
  email: "admin@gmail.com",
  password: "password123",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const cached = localStorage.getItem("auth_user")
    if (cached) setUser(JSON.parse(cached))
  }, [])

  async function login(email: string, password: string) {
    if (email !== DUMMY_USER.email || password !== DUMMY_USER.password) {
      throw new Error("Invalid credentials")
    }
    const u = { email }
    setUser(u)
    localStorage.setItem("auth_user", JSON.stringify(u))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
