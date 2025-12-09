"use client"

import { useNavigate } from "react-router-dom"
import { FaMusic, FaListUl } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

const Welcome = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
  }

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
    position: "relative",
  }

  const combinedIconStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const musicNoteStyle = {
    color: "black",
    fontSize: "48px",
  }

  const listOverlayStyle = {
    color: "black",
    fontSize: "20px",
    position: "absolute",
    right: "-8px",
    bottom: "0px",
  }

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "20px",
  }

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "15px",
    justifyContent: "center",
    marginTop: "40px",
  }

  const buttonStyle = {
    backgroundColor: "#333333",
    color: "white",
    border: "none",
    padding: "0 20px",
    height: "40px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
  }

  // If user is logged in, redirect to playlists
  if (loading) {
    return (
      <div style={containerStyle}>
        <p>Loading...</p>
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
      <h1 style={titleStyle}>The Playlister</h1>
      <div style={logoStyle}>
        <div style={combinedIconStyle}>
          <FaMusic style={musicNoteStyle} />
          <FaListUl style={listOverlayStyle} />
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button
          onClick={() => navigate("/playlists")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#333333")}
          style={buttonStyle}
        >
          Continue as Guest
        </button>
        <button
          onClick={() => navigate("/login")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#333333")}
          style={buttonStyle}
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#333333")}
          style={buttonStyle}
        >
          Create Account
        </button>
      </div>
    </div>
  )
}

export default Welcome
