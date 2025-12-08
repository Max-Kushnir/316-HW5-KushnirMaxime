"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.getCurrentUser()
        if (response.success) {
          setUser(response.data.user)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await api.login(email, password)
      if (response.success) {
        setUser(response.data.user)
        return response
      } else {
        setError(response.message || "Login failed")
        return response
      }
    } catch (err) {
      const message = err.message || "Login error"
      setError(message)
      return { success: false, message }
    }
  }

  const register = async (email, username, password, avatarImage = null) => {
    try {
      setError(null)
      const response = await api.register(email, username, password, avatarImage)
      if (response.success) {
        setUser(response.data.user)
        return response
      } else {
        setError(response.message || "Registration failed")
        return response
      }
    } catch (err) {
      const message = err.message || "Registration error"
      setError(message)
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await api.logout()
      setUser(null)
      setError(null)
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const updateProfile = async (username, password, avatarImage) => {
    try {
      setError(null)
      const response = await api.updateUserProfile(username, password, avatarImage)
      if (response.success) {
        setUser(response.data.user)
        return response
      } else {
        setError(response.message || "Update failed")
        return response
      }
    } catch (err) {
      const message = err.message || "Update error"
      setError(message)
      return { success: false, message }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
