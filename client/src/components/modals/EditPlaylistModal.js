"use client"

import { useState } from "react"
import api from "../../services/api"

const EditPlaylistModal = ({ playlist, onClose, onSave }) => {
  const [name, setName] = useState(playlist.name)
  const [songs, setSongs] = useState(playlist.playlist_songs || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [availableSongs, setAvailableSongs] = useState([])
  const [showAddSong, setShowAddSong] = useState(false)

  const handleAddSong = async (songId) => {
    try {
      setLoading(true)
      const result = await api.addSongToPlaylist(playlist.id, songId)
      if (result.success) {
        setSongs([...songs, result.data])
        setShowAddSong(false)
      } else {
        setError(result.message || "Failed to add song")
      }
    } catch (err) {
      setError("Error adding song")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSong = async (songId) => {
    try {
      setLoading(true)
      const result = await api.removeSongFromPlaylist(playlist.id, songId)
      if (result.success) {
        setSongs(songs.filter((s) => s.id !== songId))
      } else {
        setError(result.message || "Failed to remove song")
      }
    } catch (err) {
      setError("Error removing song")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSave(playlist.id, name)
    setLoading(false)
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
    overflowY: "auto",
  }

  const modalStyle = {
    backgroundColor: "#C8E6C9",
    borderRadius: "8px",
    padding: "30px",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    margin: "20px auto",
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

  const songsListStyle = {
    backgroundColor: "#fff",
    borderRadius: "4px",
    padding: "10px",
    maxHeight: "200px",
    overflowY: "auto",
    marginBottom: "15px",
  }

  const songItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #eee",
    fontSize: "12px",
  }

  const removeButtonStyle = {
    backgroundColor: "#C62828",
    color: "white",
    border: "none",
    padding: "4px 8px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "10px",
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
        <div style={headerStyle}>Edit Playlist</div>

        {error && (
          <div
            style={{
              backgroundColor: "#FFCDD2",
              color: "#C62828",
              padding: "8px",
              borderRadius: "4px",
              marginBottom: "15px",
              fontSize: "12px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Playlist Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Songs ({songs.length})</label>
            <div style={songsListStyle}>
              {songs.map((playlistSong) => (
                <div key={playlistSong.id} style={songItemStyle}>
                  <span>{playlistSong.song?.title || "Unknown"}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSong(playlistSong.song_id)}
                    style={removeButtonStyle}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAddSong(!showAddSong)}
              style={{ ...inputStyle, backgroundColor: "#90EE90", cursor: "pointer", fontWeight: "bold" }}
            >
              {showAddSong ? "Cancel Add" : "+ Add Song"}
            </button>
          </div>

          <div style={buttonsContainerStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle} disabled={loading}>
              Cancel
            </button>
            <button type="submit" style={submitButtonStyle} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPlaylistModal
