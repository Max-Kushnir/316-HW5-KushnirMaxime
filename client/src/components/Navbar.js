"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
    setShowMenu(false)
  }

  const navbarStyle = {
    backgroundColor: "#FF00FF",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 500,
  }

  const navLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  }

  const homeButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
    transition: "opacity 0.2s",
  }

  const navButtonStyle = {
    backgroundColor: "#9C27B0",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  }

  const accountMenuStyle = {
    position: "relative",
    display: "inline-block",
  }

  const menuButtonStyle = {
    backgroundColor: "white",
    color: "#FF00FF",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "background-color 0.2s",
  }

  const dropdownStyle = {
    position: "absolute",
    top: "50px",
    right: "0",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "4px",
    minWidth: "150px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 1000,
  }

  const menuItemStyle = {
    display: "block",
    width: "100%",
    padding: "10px 16px",
    border: "none",
    backgroundColor: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    borderBottom: "1px solid #f0f0f0",
    transition: "background-color 0.2s",
  }

  return (
    <nav style={navbarStyle}>
      <div style={navLeftStyle}>
        <button
          onClick={() => navigate("/")}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
          style={homeButtonStyle}
        >
          🎵 Playlister
        </button>
        {user && (
          <>
            <button
              onClick={() => navigate("/playlists")}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#7B1FA2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#9C27B0")}
              style={navButtonStyle}
            >
              Playlists
            </button>
            <button
              onClick={() => navigate("/songs")}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#7B1FA2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#9C27B0")}
              style={navButtonStyle}
            >
              Songs
            </button>
          </>
        )}
      </div>

      <div style={accountMenuStyle}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
          style={menuButtonStyle}
        >
          {user ? `${user.username}` : "Account"} ▼
        </button>
        {showMenu && (
          <div style={dropdownStyle}>
            {user ? (
              <>
                <button
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#CE93D8")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  onClick={() => {
                    navigate("/account")
                    setShowMenu(false)
                  }}
                  style={menuItemStyle}
                >
                  Edit Account
                </button>
                <button
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#CE93D8")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  onClick={handleLogout}
                  style={{ ...menuItemStyle, borderBottom: "none" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#CE93D8")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  onClick={() => {
                    navigate("/login")
                    setShowMenu(false)
                  }}
                  style={menuItemStyle}
                >
                  Login
                </button>
                <button
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#CE93D8")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                  onClick={() => {
                    navigate("/register")
                    setShowMenu(false)
                  }}
                  style={{ ...menuItemStyle, borderBottom: "none" }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
