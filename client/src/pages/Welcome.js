"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Welcome = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 50px)",
    backgroundColor: "#FFE4F3",
    padding: "20px",
  }

  const contentStyle = {
    backgroundColor: "#FFFDE7",
    padding: "50px 40px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
  }

  const logoStyle = {
    fontSize: "48px",
    marginBottom: "10px",
  }

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: "40px",
  }

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  }

  const guestButtonStyle = {
    backgroundColor: "#7B1FA2",
    color: "white",
    border: "none",
    padding: "0 20px",
    height: "40px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
    width: "100%",
  }

  const loginButtonStyle = {
    backgroundColor: "#9C27B0",
    color: "white",
    border: "none",
    padding: "0 20px",
    height: "40px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
    width: "100%",
  }

  const createAccountButtonStyle = {
    backgroundColor: "white",
    color: "#9C27B0",
    border: "2px solid #9C27B0",
    padding: "0 20px",
    height: "40px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
  }

  // If user is logged in, redirect to playlists
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    navigate("/playlists")
    return null
  }

  // Guest user - show welcome screen with three buttons
  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={logoStyle}>🎵📋</div>
        <h1 style={titleStyle}>The Playlister</h1>

        <div style={buttonContainerStyle}>
          <button
            onClick={() => navigate("/playlists")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#5D1B82")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#7B1FA2")}
            style={guestButtonStyle}
          >
            Continue as Guest
          </button>
          <button
            onClick={() => navigate("/login")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#7B1FA2")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#9C27B0")}
            style={loginButtonStyle}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#F3E5F5")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
            style={createAccountButtonStyle}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Welcome
