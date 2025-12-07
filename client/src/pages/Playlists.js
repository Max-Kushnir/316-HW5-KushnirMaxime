import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { playlistsApi } from '../services/api';
import PlaylistCard from '../components/PlaylistCard';
import Modal from '../components/Modal';

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search filters
  const [nameFilter, setNameFilter] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [songTitleFilter, setSongTitleFilter] = useState('');
  const [songArtistFilter, setSongArtistFilter] = useState('');
  const [songYearFilter, setSongYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Modals
  const [editModal, setEditModal] = useState(null);
  const [playModal, setPlayModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await playlistsApi.getAll(filters);
      setPlaylists(data.playlists || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = {};
    if (nameFilter) filters.name = nameFilter;
    if (usernameFilter) filters.username = usernameFilter;
    if (songTitleFilter) filters.songTitle = songTitleFilter;
    if (songArtistFilter) filters.songArtist = songArtistFilter;
    if (songYearFilter) filters.songYear = songYearFilter;
    if (sortBy) {
      filters.sortBy = sortBy;
      filters.sortOrder = sortOrder;
    }
    loadPlaylists(filters);
  };

  const handleClear = () => {
    setNameFilter('');
    setUsernameFilter('');
    setSongTitleFilter('');
    setSongArtistFilter('');
    setSongYearFilter('');
    setSortBy('');
    setSortOrder('');
    loadPlaylists();
  };

  const handleNewPlaylist = async () => {
    try {
      await playlistsApi.create();
      loadPlaylists();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (playlist) => {
    setEditModal(playlist);
    setEditName(playlist.name);
  };

  const handleSaveEdit = async () => {
    try {
      await playlistsApi.update(editModal.id, { name: editName });
      setEditModal(null);
      loadPlaylists();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (playlist) => {
    setDeleteModal(playlist);
  };

  const handleConfirmDelete = async () => {
    try {
      await playlistsApi.delete(deleteModal.id);
      setDeleteModal(null);
      loadPlaylists();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = async (playlist) => {
    try {
      await playlistsApi.copy(playlist.id);
      loadPlaylists();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlay = async (playlist) => {
    try {
      const data = await playlistsApi.getById(playlist.id);
      setPlayModal(data.playlist);
      // Record listen
      const identifier = user ? `user_${user.id}` : `guest_${Date.now()}`;
      await playlistsApi.listen(playlist.id, identifier);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <h2 style={styles.panelTitle}>Playlists</h2>

        <div style={styles.field}>
          <input
            type="text"
            placeholder="by Playlist Name"
            style={styles.input}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <input
            type="text"
            placeholder="by User Name"
            style={styles.input}
            value={usernameFilter}
            onChange={(e) => setUsernameFilter(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <input
            type="text"
            placeholder="by Song Title"
            style={styles.input}
            value={songTitleFilter}
            onChange={(e) => setSongTitleFilter(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <input
            type="text"
            placeholder="by Song Artist"
            style={styles.input}
            value={songArtistFilter}
            onChange={(e) => setSongArtistFilter(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <input
            type="text"
            placeholder="by Song Year"
            style={styles.input}
            value={songYearFilter}
            onChange={(e) => setSongYearFilter(e.target.value)}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.searchButton} onClick={handleSearch}>
            🔍 Search
          </button>
          <button style={styles.clearButton} onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.header}>
          <div style={styles.sortContainer}>
            <label>Sort: </label>
            <select
              style={styles.select}
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by);
                setSortOrder(order);
              }}
            >
              <option value="-">None</option>
              <option value="listener_count-desc">Listeners (Hi-Lo)</option>
              <option value="listener_count-asc">Listeners (Lo-Hi)</option>
              <option value="name-asc">Playlist Name (A-Z)</option>
              <option value="name-desc">Playlist Name (Z-A)</option>
              <option value="username-asc">User Name (A-Z)</option>
              <option value="username-desc">User Name (Z-A)</option>
            </select>
          </div>

          {user && (
            <button style={styles.newButton} onClick={handleNewPlaylist}>
              + New Playlist
            </button>
          )}
        </div>

        <div style={styles.count}>{playlists.length} Playlists</div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.list}>
          {loading ? (
            <div>Loading...</div>
          ) : playlists.length === 0 ? (
            <div>No playlists found</div>
          ) : (
            playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopy}
                onPlay={handlePlay}
              />
            ))
          )}
        </div>
      </div>

      {/* Edit Playlist Modal */}
      <Modal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit Playlist"
      >
        <div style={styles.field}>
          <label>Playlist Name</label>
          <input
            type="text"
            style={styles.input}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </div>
        <div style={styles.modalButtons}>
          <button style={styles.completeButton} onClick={handleSaveEdit}>
            Save
          </button>
          <button style={styles.cancelButton} onClick={() => setEditModal(null)}>
            Close
          </button>
        </div>
      </Modal>

      {/* Play Playlist Modal */}
      <Modal
        isOpen={!!playModal}
        onClose={() => setPlayModal(null)}
        title="Play Playlist"
        size="large"
      >
        <div>
          <h3>{playModal?.name}</h3>
          <p>Owner: {playModal?.owner?.username}</p>
          <div style={styles.songsList}>
            {playModal?.songs?.map((song, index) => (
              <div key={song.id} style={styles.songItem}>
                {index + 1}. {song.title} by {song.artist} ({song.year})
                <br />
                <small>YouTube ID: {song.youtube_id}</small>
              </div>
            ))}
          </div>
          <div style={styles.modalButtons}>
            <button style={styles.cancelButton} onClick={() => setPlayModal(null)}>
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete playlist?"
      >
        <p>
          Are you sure you want to delete the {deleteModal?.name} playlist?
          <br />
          Doing so means it will be permanently removed.
        </p>
        <div style={styles.modalButtons}>
          <button style={styles.deleteButton} onClick={handleConfirmDelete}>
            Delete Playlist
          </button>
          <button style={styles.cancelButton} onClick={() => setDeleteModal(null)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: 'calc(100vh - 50px)',
    background: '#FFE4F3',
  },
  leftPanel: {
    width: '300px',
    background: '#FFFDE7',
    padding: '20px',
    borderRight: '1px solid #ddd',
  },
  rightPanel: {
    flex: 1,
    padding: '20px',
  },
  panelTitle: {
    color: '#9C27B0',
    fontSize: '28px',
    marginBottom: '20px',
  },
  field: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  searchButton: {
    flex: 1,
    background: '#9C27B0',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  clearButton: {
    flex: 1,
    background: '#fff',
    color: '#9C27B0',
    border: '2px solid #9C27B0',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  sortContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  select: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  newButton: {
    background: '#9C27B0',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  count: {
    marginBottom: '15px',
    fontSize: '16px',
    color: '#666',
  },
  error: {
    background: '#ffebee',
    color: '#D32F2F',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
  },
  list: {
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
  },
  songsList: {
    marginTop: '15px',
  },
  songItem: {
    padding: '10px',
    background: '#FFF9C4',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  completeButton: {
    background: '#9C27B0',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    background: '#fff',
    color: '#9C27B0',
    border: '2px solid #9C27B0',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    background: '#E91E63',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Playlists;
