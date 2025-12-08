"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Account = () => {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState(user?.username || "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target.result
        setAvatar(base64String)
        setAvatarPreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!username.trim()) {
      setError("Username cannot be empty")
      return
    }

    if (password && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password && password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)
    const result = await updateProfile(username, password || undefined, avatar)
    if (result.success) {
      setSuccess("Profile updated successfully!")
      setPassword("")
      setConfirmPassword("")
      setAvatar(null)
      setTimeout(() => navigate("/playlists"), 2000)
    } else {
      setError(result.message || "Update failed")
    }
    setLoading(false)
  }

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 50px)",
    backgroundColor: "#FFE4F3",
    padding: "20px",
  }

  const formContainerStyle = {
    backgroundColor: "#FFFDE7",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    width: "100%",
  }

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: "30px",
    textAlign: "center",
  }

  const formGroupStyle = {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  }

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
  }

  const inputStyle = {
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontFamily: "inherit",
  }

  const submitButtonStyle = {
    backgroundColor: "#9C27B0",
    color: "white",
    border: "none",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.2s",
  }

  const cancelButtonStyle = {
    ...submitButtonStyle,
    backgroundColor: "#7B1FA2",
  }

  const errorStyle = {
    backgroundColor: "#FFCDD2",
    color: "#C62828",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "14px",
  }

  const successStyle = {
    backgroundColor: "#C8E6C9",
    color: "#2E7D32",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "14px",
  }

  const avatarPreviewStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginTop: "10px",
    border: "2px solid #9C27B0",
  }

  const userEmailStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
  }

  const helperTextStyle = {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  }

  const dividerStyle = {
    height: "1px",
    backgroundColor: "#ddd",
    margin: "20px 0",
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Edit Account</h1>

        <div style={userEmailStyle}>
          <strong>Email:</strong> {user?.email}
          <div style={helperTextStyle}>(email cannot be changed)</div>
        </div>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={dividerStyle} />

          <div style={formGroupStyle}>
            <label style={labelStyle}>New Password (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              style={inputStyle}
            />
            <div style={helperTextStyle}>Must be at least 8 characters</div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              style={inputStyle}
            />
          </div>

          <div style={dividerStyle} />

          <div style={formGroupStyle}>
            <label style={labelStyle}>Avatar Image</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={inputStyle} />
            <div style={helperTextStyle}>Max 5MB</div>
            {avatarPreview && (
              <img src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" style={avatarPreviewStyle} />
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => navigate("/playlists")} style={cancelButtonStyle}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Account
