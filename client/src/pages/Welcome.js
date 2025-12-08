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

  const titleStyle = {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: "15px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
  }

  const subtitleStyle = {
    fontSize: "18px",
    color: "#666",
    marginBottom: "40px",
    lineHeight: "1.6",
  }

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  }

  const buttonStyle = {
    backgroundColor: "#9C27B0",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "white",
    color: "#9C27B0",
    border: "2px solid #9C27B0",
  }

  const guestButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#7B1FA2",
  }

  const welcomeMessageStyle = {
    fontSize: "16px",
    marginBottom: "30px",
    color: "#333",
  }

  const dividerStyle = {
    margin: "30px 0",
    height: "1px",
    backgroundColor: "#ddd",
  }

  const featureListStyle = {
    textAlign: "left",
    margin: "30px 0",
    fontSize: "14px",
    color: "#666",
  }

  const featureItemStyle = {
    marginBottom: "10px",
    paddingLeft: "20px",
    position: "relative",
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>🎵 Playlister</h1>
        <p style={subtitleStyle}>Create, manage, and share YouTube playlists with ease</p>

        {user ? (
          <div>
            <div style={welcomeMessageStyle}>
              Welcome back, <strong>{user.username}</strong>!
            </div>
            <div style={buttonContainerStyle}>
              <button
                onClick={() => navigate("/playlists")}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#7B1FA2")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#9C27B0")}
                style={buttonStyle}
              >
                View My Playlists
              </button>
              <button
                onClick={() => navigate("/songs")}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "white")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                style={secondaryButtonStyle}
              >
                Browse Song Catalog
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={featureListStyle}>
              <div style={featureItemStyle}>✓ Create and organize playlists</div>
              <div style={featureItemStyle}>✓ Add any YouTube video as a song</div>
              <div style={featureItemStyle}>✓ Share playlists with others</div>
              <div style={featureItemStyle}>✓ Browse and discover new songs</div>
            </div>

            <div style={dividerStyle} />

            <div style={buttonContainerStyle}>
              <button
                onClick={() => navigate("/login")}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#7B1FA2")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#9C27B0")}
                style={buttonStyle}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                onMouseEnter={(e) => (e.target.style.borderColor = "#7B1FA2")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#9C27B0")}
                style={secondaryButtonStyle}
              >
                Create Account
              </button>
            </div>

            <div style={dividerStyle} />

            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>or browse as a guest</p>
            <button
              onClick={() => navigate("/playlists")}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#5D1B82")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#7B1FA2")}
              style={guestButtonStyle}
            >
              Browse Playlists
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Welcome
