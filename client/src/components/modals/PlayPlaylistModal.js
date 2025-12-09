"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa"
import api from "../../services/api"

const PlayPlaylistModal = ({ playlist, onClose, onListenerRecorded }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const playerRef = useRef(null)
  const playerContainerRef = useRef(null)

  // Refs to track state for stale closure fix in YouTube callbacks
  const repeatRef = useRef(repeat)
  const currentSongIndexRef = useRef(currentSongIndex)
  const songsLengthRef = useRef(0)

  // Track last counted song to avoid duplicate listen counts
  const lastCountedSongIdRef = useRef(null)

  // Track if listener has been recorded (prevents duplicate API calls)
  const listenerRecordedRef = useRef(false)

  const songs = playlist.playlist_songs || []
  const currentSong = songs[currentSongIndex]?.song
  const owner = playlist.owner || {}

  // Keep refs in sync with state (fixes stale closure in YouTube callbacks)
  useEffect(() => {
    repeatRef.current = repeat
  }, [repeat])

  useEffect(() => {
    currentSongIndexRef.current = currentSongIndex
  }, [currentSongIndex])

  useEffect(() => {
    songsLengthRef.current = songs.length
  }, [songs.length])

  // Record playlist listener on mount (only once per modal open)
  useEffect(() => {
    if (listenerRecordedRef.current) return  // Already recorded
    listenerRecordedRef.current = true

    api.recordPlaylistListener(playlist.id).then((result) => {
      if (result.success && result.data?.isNewListener && onListenerRecorded) {
        onListenerRecorded(playlist.id)
      }
    })
  }, [playlist.id, onListenerRecorded])

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer()
      return
    }

    // Load the API
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    // Set up callback for when API is ready
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer()
    }

    return () => {
      // Cleanup player on unmount
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [])

  // Initialize YouTube player
  const initializePlayer = useCallback(() => {
    if (!currentSong?.youtube_id || !playerContainerRef.current) return
    if (playerRef.current) {
      playerRef.current.destroy()
    }

    playerRef.current = new window.YT.Player(playerContainerRef.current, {
      height: "100%",
      width: "100%",
      videoId: currentSong.youtube_id,
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: (event) => {
          setPlayerReady(true)
          event.target.playVideo()
          setIsPlaying(true)
        },
        onStateChange: (event) => {
          // YT.PlayerState.ENDED = 0
          if (event.data === 0) {
            handleSongEnd()
          }
          // YT.PlayerState.PLAYING = 1
          if (event.data === 1) {
            setIsPlaying(true)
            // Record song listen (only once per song)
            const currentIdx = currentSongIndexRef.current
            const songAtIndex = songs[currentIdx]?.song
            if (songAtIndex && songAtIndex.id !== lastCountedSongIdRef.current) {
              lastCountedSongIdRef.current = songAtIndex.id
              api.recordSongListen(songAtIndex.id)
            }
          }
          // YT.PlayerState.PAUSED = 2
          if (event.data === 2) {
            setIsPlaying(false)
          }
        },
      },
    })
  }, [currentSong?.youtube_id])

  // Re-initialize player when current song changes
  useEffect(() => {
    if (window.YT && window.YT.Player && currentSong?.youtube_id) {
      if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
        playerRef.current.loadVideoById(currentSong.youtube_id)
        setIsPlaying(true)
        // Record song listen when switching songs (only once per song)
        if (currentSong.id !== lastCountedSongIdRef.current) {
          lastCountedSongIdRef.current = currentSong.id
          api.recordSongListen(currentSong.id)
        }
      } else {
        initializePlayer()
      }
    }
  }, [currentSongIndex, currentSong?.youtube_id, currentSong?.id, initializePlayer])

  // Handle song ending - auto-advance with repeat logic
  // Uses refs to avoid stale closure issues with YouTube player callbacks
  const handleSongEnd = useCallback(() => {
    const currentIdx = currentSongIndexRef.current
    const totalSongs = songsLengthRef.current
    const isLastSong = currentIdx === totalSongs - 1

    if (isLastSong) {
      if (repeatRef.current) {
        // Repeat is on: go to first song
        setCurrentSongIndex(0)
      } else {
        // Repeat is off: stop playing (stay on last song, but don't auto-advance)
        setIsPlaying(false)
      }
    } else {
      // Not last song: always advance to next
      setCurrentSongIndex((prev) => prev + 1)
    }
  }, []) // No dependencies needed - uses refs

  // Navigation handlers - wrap-around ALWAYS
  const handlePrevious = () => {
    if (currentSongIndex === 0) {
      // Wrap to last song
      setCurrentSongIndex(songs.length - 1)
    } else {
      setCurrentSongIndex(currentSongIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentSongIndex === songs.length - 1) {
      // Wrap to first song
      setCurrentSongIndex(0)
    } else {
      setCurrentSongIndex(currentSongIndex + 1)
    }
  }

  // Play/Pause toggle
  const handlePlayPause = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  // Click song to jump
  const handleSongClick = (index) => {
    setCurrentSongIndex(index)
  }

  // Get avatar display (initials fallback)
  const getAvatarDisplay = () => {
    if (owner.avatar_image) {
      return (
        <img
          src={owner.avatar_image}
          alt={owner.username}
          style={avatarStyle}
        />
      )
    }
    // Fallback to initials
    const initials = (owner.username || "U").charAt(0).toUpperCase()
    return <div style={avatarInitialsStyle}>{initials}</div>
  }

  // Styles
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }

  const modalStyle = {
    backgroundColor: "#90EE90",
    borderRadius: "8px",
    maxWidth: "900px",
    width: "90%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    overflow: "hidden",
  }

  const modalHeaderStyle = {
    backgroundColor: "#228B22",
    padding: "12px 16px",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
  }

  const modalBodyStyle = {
    padding: "20px",
    backgroundColor: "#90EE90",
  }

  const twoColumnLayoutStyle = {
    display: "flex",
    gap: "20px",
  }

  // Left panel - 60%
  const leftPanelStyle = {
    flex: "0 0 60%",
    backgroundColor: "white",
    borderRadius: "4px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    maxHeight: "400px",
  }

  // Right panel - 40%
  const rightPanelStyle = {
    flex: "0 0 calc(40% - 20px)",
    backgroundColor: "#90EE90",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }

  // Header with avatar and playlist name
  const headerRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "4px",
  }

  const avatarStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    objectFit: "cover",
  }

  const avatarInitialsStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#9C27B0",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
  }

  const playlistNameStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  }

  const ownerNameStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "12px",
    marginLeft: "60px", // Align with text after avatar
  }

  const songListStyle = {
    flex: 1,
    overflowY: "auto",
  }

  const getSongItemStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    padding: "8px",
    marginBottom: "4px",
    fontSize: "14px",
    backgroundColor: isActive ? "#FFEB3B" : "#FFF9C4",
    cursor: "pointer",
    fontWeight: isActive ? "bold" : "normal",
    borderRadius: "4px",
    border: "1px solid black",
    width: "100%",
    boxSizing: "border-box",
  })

  // YouTube player container - 16:9 aspect ratio
  const playerWrapperStyle = {
    width: "100%",
    paddingTop: "56.25%", // 16:9 aspect ratio
    position: "relative",
    backgroundColor: "#000",
    borderRadius: "4px",
    overflow: "hidden",
  }

  const playerInnerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  }

  // Gray control box
  const controlBoxStyle = {
    backgroundColor: "#CCCCCC",
    padding: "12px 20px",
    borderRadius: "4px",
    marginTop: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }

  const controlButtonStyle = {
    backgroundColor: "#9C27B0",
    color: "white",
    border: "none",
    width: "40px",
    height: "40px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  }

  const repeatLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
  }

  const closeButtonContainerStyle = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
  }

  const closeButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 30px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  }

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>Play Playlist</div>
        <div style={modalBodyStyle}>
          <div style={twoColumnLayoutStyle}>
            {/* Left Panel - 60% - White Box */}
            <div style={leftPanelStyle}>
              {/* Header: Avatar + Playlist Name */}
              <div style={headerRowStyle}>
                {getAvatarDisplay()}
                <span style={playlistNameStyle}>{playlist.name}</span>
              </div>

              {/* Owner Username */}
              <div style={ownerNameStyle}>{owner.username}</div>

              {/* Scrollable Song List */}
              <div style={songListStyle}>
                {songs.length === 0 ? (
                  <div style={{ padding: "12px", color: "#666", fontStyle: "italic" }}>
                    No songs in this playlist
                  </div>
                ) : (
                  songs.map((playlistSong, index) => (
                    <div
                      key={playlistSong.id}
                      onClick={() => handleSongClick(index)}
                      style={getSongItemStyle(index === currentSongIndex)}
                    >
                      {index + 1}. {playlistSong.song?.title} by {playlistSong.song?.artist} ({playlistSong.song?.year})
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel - 40% - Green Background */}
            <div style={rightPanelStyle}>
              {/* YouTube Player (16:9) */}
              <div style={playerWrapperStyle}>
                <div style={playerInnerStyle}>
                  <div ref={playerContainerRef} style={{ width: "100%", height: "100%" }} />
                </div>
              </div>

              {/* Gray Control Box */}
              <div style={controlBoxStyle}>
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  style={controlButtonStyle}
                  title="Previous"
                  disabled={songs.length === 0}
                >
                  <FaStepBackward />
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={handlePlayPause}
                  style={controlButtonStyle}
                  title={isPlaying ? "Pause" : "Play"}
                  disabled={songs.length === 0}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  style={controlButtonStyle}
                  title="Next"
                  disabled={songs.length === 0}
                >
                  <FaStepForward />
                </button>

                {/* Repeat Checkbox */}
                <label style={repeatLabelStyle}>
                  <input
                    type="checkbox"
                    checked={repeat}
                    onChange={(e) => setRepeat(e.target.checked)}
                  />
                  Repeat
                </label>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div style={closeButtonContainerStyle}>
            <button onClick={onClose} style={closeButtonStyle}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayPlaylistModal
