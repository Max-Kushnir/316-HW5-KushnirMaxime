import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { songsApi, playlistsApi } from '../services/api';
import SongCard from '../components/SongCard';
import Modal from '../components/Modal';

const Songs = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search filters
  const [titleFilter, setTitleFilter] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Modals
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [newSongModal, setNewSongModal] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formArtist, setFormArtist] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formYoutubeId, setFormYoutubeId] = useState('');

  useEffect(() => {
    loadSongs();
    if (user) {
      loadUserPlaylists();
    }
  }, [user]);

  const loadSongs = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await songsApi.getAll(filters);
      setSongs(data.songs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPlaylists = async () => {
    try {
      const data = await playlistsApi.getAll({});
      const myPlaylists = data.playlists.filter((p) => p.owner_id === user.id);
      setUserPlaylists(myPlaylists);
    } catch (err) {
      console.error('Error loading playlists:', err);
    }
  };

  const handleSearch = () => {
    const filters = {};
    if (titleFilter) filters.title = titleFilter;
    if (artistFilter) filters.artist = artistFilter;
    if (yearFilter) filters.year = yearFilter;
    if (sortBy) {
      filters.sortBy = sortBy;
      filters.sortOrder = sortOrder;
    }
    loadSongs(filters);
  };

  const handleClear = () => {
    setTitleFilter('');
    setArtistFilter('');
    setYearFilter('');
    setSortBy('');
    setSortOrder('');
    loadSongs();
  };

  const handleNewSong = () => {
    setFormTitle('');
    setFormArtist('');
    setFormYear('');
    setFormYoutubeId('');
    setNewSongModal(true);
  };

  const handleSaveNewSong = async () => {
    try {
      await songsApi.create({
        title: formTitle,
        artist: formArtist,
        year: parseInt(formYear),
        youtube_id: formYoutubeId,
      });
      setNewSongModal(false);
      loadSongs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (song) => {
    setEditModal(song);
    setFormTitle(song.title);
    setFormArtist(song.artist);
    setFormYear(song.year.toString());
    setFormYoutubeId(song.youtube_id);
  };

  const handleSaveEdit = async () => {
    try {
      await songsApi.update(editModal.id, {
        title: formTitle,
        artist: formArtist,
        year: parseInt(formYear),
        youtube_id: formYoutubeId,
      });
      setEditModal(null);
      loadSongs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (song) => {
    setDeleteModal(song);
  };

  const handleConfirmDelete = async () => {
    try {
      await songsApi.delete(deleteModal.id);
      setDeleteModal(null);
      loadSongs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddToPlaylist = async (song, playlist) => {
    try {
      await playlistsApi.addSong(playlist.id, song.id);
      alert(`Added "${song.title}" to "${playlist.name}"`);
    } catch (err) {
      setError(err.message);
    }
  };

  const isFormValid = formTitle && formArtist && formYear && formYoutubeId;

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <h2 style={styles.panelTitle}>Song Catalog</h2>

        <div style={styles.field}>
          <input
            type="text"
            placeholder="by Title"
            style={styles.input}
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <input
            type="text"
            placeholder="by Artist"
            style={styles.input}
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <input
            type="text"
            placeholder="by Year"
            style={styles.input}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
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

        <div style={styles.preview}>
          <div style={styles.previewTitle}>YouTube Preview</div>
          <div style={styles.previewBox}>Select a song to preview</div>
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
              <option value="listen_count-desc">Listens (Hi-Lo)</option>
              <option value="listen_count-asc">Listens (Lo-Hi)</option>
              <option value="playlist_count-desc">Playlists (Hi-Lo)</option>
              <option value="playlist_count-asc">Playlists (Lo-Hi)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="artist-asc">Artist (A-Z)</option>
              <option value="artist-desc">Artist (Z-A)</option>
              <option value="year-desc">Year (Hi-Lo)</option>
              <option value="year-asc">Year (Lo-Hi)</option>
            </select>
          </div>

          {user && (
            <button style={styles.newButton} onClick={handleNewSong}>
              + New Song
            </button>
          )}
        </div>

        <div style={styles.count}>{songs.length} Songs</div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.list}>
          {loading ? (
            <div>Loading...</div>
          ) : songs.length === 0 ? (
            <div>No songs found</div>
          ) : (
            songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddToPlaylist={handleAddToPlaylist}
                userPlaylists={userPlaylists}
              />
            ))
          )}
        </div>
      </div>

      {/* New Song Modal */}
      <Modal
        isOpen={newSongModal}
        onClose={() => setNewSongModal(false)}
        title="New Song"
      >
        <div style={styles.field}>
          <label>Title</label>
          <input
            type="text"
            style={styles.input}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label>Artist</label>
          <input
            type="text"
            style={styles.input}
            value={formArtist}
            onChange={(e) => setFormArtist(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label>Year</label>
          <input
            type="number"
            style={styles.input}
            value={formYear}
            onChange={(e) => setFormYear(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label>YouTube ID</label>
          <input
            type="text"
            style={styles.input}
            value={formYoutubeId}
            onChange={(e) => setFormYoutubeId(e.target.value)}
          />
        </div>
        <div style={styles.modalButtons}>
          <button
            style={{
              ...styles.completeButton,
              background: isFormValid ? '#9C27B0' : '#ccc',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
            }}
            onClick={handleSaveNewSong}
            disabled={!isFormValid}
          >
            Complete
          </button>
          <button style={styles.cancelButton} onClick={() => setNewSongModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Edit Song Modal */}
      <Modal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit Song"
      >
        <div style={styles.field}>
          <label>Title</label>
          <input
            type="text"
            style={styles.input}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label>Artist</label>
          <input
            type="text"
            style={styles.input}
            value={formArtist}
            onChange={(e) => setFormArtist(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label>Year</label>
          <input
            type="number"
            style={styles.input}
            value={formYear}
            onChange={(e) => setFormYear(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label>YouTube ID</label>
          <input
            type="text"
            style={styles.input}
            value={formYoutubeId}
            onChange={(e) => setFormYoutubeId(e.target.value)}
          />
        </div>
        <div style={styles.modalButtons}>
          <button
            style={{
              ...styles.completeButton,
              background: isFormValid ? '#9C27B0' : '#ccc',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
            }}
            onClick={handleSaveEdit}
            disabled={!isFormValid}
          >
            Complete
          </button>
          <button style={styles.cancelButton} onClick={() => setEditModal(null)}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Remove Song?"
      >
        <p>
          Are you sure you want to remove the song from the catalog?
          <br />
          Doing so will remove it from all of your playlists.
        </p>
        <div style={styles.modalButtons}>
          <button style={styles.deleteButton} onClick={handleConfirmDelete}>
            Remove Song
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
  preview: {
    marginTop: '30px',
  },
  previewTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  previewBox: {
    background: '#fff',
    padding: '60px 20px',
    borderRadius: '4px',
    textAlign: 'center',
    color: '#999',
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
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  completeButton: {
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
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

export default Songs;
