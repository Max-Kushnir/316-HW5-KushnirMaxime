"use client"

const DeletePlaylistModal = ({ playlist, onClose, onDelete }) => {
  const handleDelete = async () => {
    await onDelete(playlist.id)
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
    backgroundColor: "#FFCDD2",
    borderRadius: "8px",
    padding: "30px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  }

  const headerStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#C62828",
    marginBottom: "15px",
  }

  const messageStyle = {
    fontSize: "14px",
    color: "#333",
    marginBottom: "20px",
  }

  const buttonsContainerStyle = {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  }

  const deleteButtonStyle = {
    backgroundColor: "#C62828",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  }

  const cancelButtonStyle = {
    backgroundColor: "#EF9A9A",
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
        <div style={headerStyle}>Delete Playlist?</div>
        <div style={messageStyle}>Are you sure you want to delete "{playlist.name}"? This action cannot be undone.</div>
        <div style={buttonsContainerStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>
            Cancel
          </button>
          <button onClick={handleDelete} style={deleteButtonStyle}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletePlaylistModal
