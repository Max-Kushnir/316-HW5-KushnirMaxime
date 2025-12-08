"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"
import CreateSongModal from "../components/modals/CreateSongModal"
import EditSongModal from "../components/modals/EditSongModal"
import DeleteSongModal from "../components/modals/DeleteSongModal"
import AddToPlaylistModal from "../components/modals/AddToPlaylistModal"

const Songs = () => {
  const { user } = useAuth()
  const [songs, setSongs] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("title")
  const [sortBy, setSortBy] = useState("title-asc")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)

  useEffect(() => {
    fetchSongs()
    if (user) fetchPlaylists()
  }, [user])

  useEffect(() => {
    filterAndSortSongs()
  }, [songs, searchQuery, searchType, sortBy])

  const fetchSongs = async () => {
    try {
      setLoading(true)
      setError("")
      const result = await api.getSongs()
      if (result.success) {
        setSongs(result.data)
      } else {
        setError("Failed to load songs")
      }
    } catch (err) {
      setError("Error loading songs")
    } finally {
      setLoading(false)
    }
  }

  const fetchPlaylists = async () => {
    try {
      const result = await api.getPlaylists()
      if (result.success) {
        setPlaylists(result.data.filter((p) => p.owner_id === user.id))
      }
    } catch (err) {
      console.error("Error fetching playlists:", err)
    }
  }

  const filterAndSortSongs = () => {
    let filtered = [...songs]

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((song) => {
        const query = searchQuery.toLowerCase()
        switch (searchType) {
          case "title":
            return song.title.toLowerCase().includes(query)
          case "artist":
            return song.artist.toLowerCase().includes(query)
          case "year":
            return song.year.toString().includes(query)
          default:
            return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0
      const [sortKey, sortOrder] = sortBy.split("-")

      switch (sortKey) {
        case "title":
          compareValue = a.title.localeCompare(b.title)
          break
        case "artist":
          compareValue = a.artist.localeCompare(b.artist)
          break
        case "year":
          compareValue = a.year - b.year
          break
        case "listens":
          compareValue = (b.listen_count || 0) - (a.listen_count || 0)
          break
        case "playlists":
          const aPlaylistCount = a.playlist_songs?.length || 0
          const bPlaylistCount = b.playlist_songs?.length || 0
          compareValue = bPlaylistCount - aPlaylistCount
          break
        default:
          compareValue = 0
      }

      return sortOrder === "desc" ? -compareValue : compareValue
    })

    setFilteredSongs(filtered)
  }

  const handleCreateSong = async (title, artist, year, youtubeId) => {
    try {
      const result = await api.createSong(title, artist, year, youtubeId)
      if (result.success) {
        setSongs([...songs, result.data])
        setShowCreateModal(false)
        setSuccess("Song created successfully!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(result.message || "Failed to create song")
      }
    } catch (err) {
      setError("Error creating song")
    }
  }

  const handleEditSong = async (id, title, artist, year, youtubeId) => {
    try {
      const result = await api.updateSong(id, title, artist, year, youtubeId)
      if (result.success) {
        setSongs(songs.map((s) => (s.id === id ? result.data : s)))
        setShowEditModal(false)
        setSelectedSong(null)
        setSuccess("Song updated successfully!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(result.message || "Failed to update song")
      }
    } catch (err) {
      setError("Error updating song")
    }
  }

  const handleDeleteSong = async (id) => {
    try {
      const result = await api.deleteSong(id)
      if (result.success) {
        setSongs(songs.filter((s) => s.id !== id))
        setShowDeleteModal(false)
        setSelectedSong(null)
        setSuccess("Song deleted successfully!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(result.message || "Failed to delete song")
      }
    } catch (err) {
      setError("Error deleting song")
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    try {
      const result = await api.addSongToPlaylist(playlistId, selectedSong.id)
      if (result.success) {
        setShowAddToPlaylistModal(false)
        setSelectedSong(null)
        setSuccess("Song added to playlist!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(result.message || "Failed to add song to playlist")
      }
    } catch (err) {
      setError("Error adding song to playlist")
    }
  }

  const containerStyle = {
    minHeight: "calc(100vh - 50px)",
    backgroundColor: "#FFE4F3",
    padding: "20px",
  }

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  }

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: "20px",
  }

  const searchContainerStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  }

  const inputStyle = {
    flex: 1,
    minWidth: "200px",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  }

  const selectStyle = {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "white",
    cursor: "pointer",
  }

  const createButtonStyle = {
    backgroundColor: "#228B22",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  }

  const songsListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  }

  const songCardStyle = {
    backgroundColor: "#FFFDE7",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  }

  const songInfoStyle = {
    flex: 1,
    minWidth: "250px",
  }

  const songTitleStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: "5px",
  }

  const songMetaStyle = {
    fontSize: "12px",
    color: "#666",
  }

  const actionButtonsStyle = {
    display: "flex",
    gap: "8px",
    marginLeft: "15px",
    flexWrap: "wrap",
  }

  const smallButtonStyle = {
    padding: "6px 12px",
    fontSize: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  }

  const addButtonStyle = {
    ...smallButtonStyle,
    backgroundColor: "#228B22",
    color: "white",
  }

  const editButtonStyle = {
    ...smallButtonStyle,
    backgroundColor: "#7B1FA2",
    color: "white",
  }

  const deleteButtonStyle = {
    ...smallButtonStyle,
    backgroundColor: "#C62828",
    color: "white",
  }

  const emptyStateStyle = {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#FFFDE7",
    borderRadius: "8px",
    color: "#666",
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

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <p>Loading songs...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Song Catalog</h1>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={inputStyle}
          />
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={selectStyle}>
            <option value="title">By Title</option>
            <option value="artist">By Artist</option>
            <option value="year">By Year</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="artist-asc">Artist A-Z</option>
            <option value="artist-desc">Artist Z-A</option>
            <option value="year-asc">Year Oldest</option>
            <option value="year-desc">Year Newest</option>
            <option value="listens-desc">Most Listens</option>
            <option value="listens-asc">Least Listens</option>
            <option value="playlists-desc">Most Playlists</option>
            <option value="playlists-asc">Least Playlists</option>
          </select>
          {user && (
            <button onClick={() => setShowCreateModal(true)} style={createButtonStyle}>
              + Add Song
            </button>
          )}
        </div>

        {filteredSongs.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>No songs found. {user ? "Add your first song!" : "Login to add songs."}</p>
          </div>
        ) : (
          <div style={songsListStyle}>
            {filteredSongs.map((song) => (
              <div key={song.id} style={songCardStyle}>
                <div style={songInfoStyle}>
                  <div style={songTitleStyle}>{song.title}</div>
                  <div style={songMetaStyle}>
                    {song.artist} • {song.year} • {song.listen_count || 0} listens • In{" "}
                    {song.playlist_songs?.length || 0} playlists
                  </div>
                </div>
                <div style={actionButtonsStyle}>
                  {user && (
                    <button
                      onClick={() => {
                        setSelectedSong(song)
                        setShowAddToPlaylistModal(true)
                      }}
                      style={addButtonStyle}
                    >
                      Add to Playlist
                    </button>
                  )}
                  {user?.id === song.owner_id && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedSong(song)
                          setShowEditModal(true)
                        }}
                        style={editButtonStyle}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSong(song)
                          setShowDeleteModal(true)
                        }}
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <CreateSongModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateSong} />}
      {showEditModal && selectedSong && (
        <EditSongModal
          song={selectedSong}
          onClose={() => {
            setShowEditModal(false)
            setSelectedSong(null)
          }}
          onSave={handleEditSong}
        />
      )}
      {showDeleteModal && selectedSong && (
        <DeleteSongModal
          song={selectedSong}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedSong(null)
          }}
          onDelete={handleDeleteSong}
        />
      )}
      {showAddToPlaylistModal && selectedSong && (
        <AddToPlaylistModal
          song={selectedSong}
          playlists={playlists}
          onClose={() => {
            setShowAddToPlaylistModal(false)
            setSelectedSong(null)
          }}
          onAdd={handleAddToPlaylist}
        />
      )}
    </div>
  )
}

export default Songs
