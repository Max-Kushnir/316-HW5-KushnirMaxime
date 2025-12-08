"use client"

import { useState } from "react"

const CreatePlaylistModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    await onCreate(name)
    setLoading(false)
    setName("")
  }

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }

  const modalStyle = {
    backgroundColor: "#C8E6C9",
    borderRadius: "8px",
    padding: "30px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  }

  const headerStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#228B22",
    marginBottom: "20px",
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
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontFamily: "inherit",
  }

  const buttonsContainerStyle = {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  }

  const submitButtonStyle = {
    backgroundColor: "#228B22",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  }

  const cancelButtonStyle = {
    backgroundColor: "#90EE90",
    color: "black",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  }

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>Create New Playlist</div>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Playlist Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter playlist name"
              autoFocus
              style={inputStyle}
            />
          </div>
          <div style={buttonsContainerStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !name.trim()} style={submitButtonStyle}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePlaylistModal
