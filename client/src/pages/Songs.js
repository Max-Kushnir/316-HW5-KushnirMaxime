import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function Songs() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [filters, setFilters] = useState({ title: '', artist: '', year: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentSong, setCurrentSong] = useState(null);
  const [formData, setFormData] = useState({ title: '', artist: '', year: '', youtube_id: '' });

  useEffect(() => {
    fetchSongs();
  }, [sortBy, sortOrder]);

  const fetchSongs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.title) params.append('title', filters.title);
      if (filters.artist) params.append('artist', filters.artist);
      if (filters.year) params.append('year', filters.year);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const data = await api.get(`/songs?${params.toString()}`);
      setSongs(data.data.songs || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
      alert('Failed to fetch songs');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSongs();
  };

  const handleClear = () => {
    setFilters({ title: '', artist: '', year: '' });
    setTimeout(fetchSongs, 0);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    const [newSortBy, newSortOrder] = value.split('|');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleNewSong = () => {
    setModalMode('add');
    setCurrentSong(null);
    setFormData({ title: '', artist: '', year: '', youtube_id: '' });
    setModalOpen(true);
  };

  const handleEditSong = (song) => {
    setModalMode('edit');
    setCurrentSong(song);
    setFormData({ title: song.title, artist: song.artist, year: song.year, youtube_id: song.youtube_id });
    setModalOpen(true);
  };

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Are you sure you want to remove this song from the catalog? This will remove it from all playlists.')) {
      return;
    }

    try {
      await api.delete(`/songs/${songId}`);
      alert('Song deleted successfully');
      fetchSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
      alert(error.error?.message || 'Failed to delete song');
    }
  };

  const handleSaveSong = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        await api.post('/songs', formData);
        alert('Song created successfully');
      } else {
        await api.put(`/songs/${currentSong.id}`, formData);
        alert('Song updated successfully');
      }
      setModalOpen(false);
      fetchSongs();
    } catch (error) {
      console.error('Error saving song:', error);
      alert(error.error?.message || 'Failed to save song');
    }
  };

  const getSortValue = () => `${sortBy}|${sortOrder}`;

  return (
    <div style={{ display: 'flex', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Left Panel - Search */}
      <div style={{ width: '300px', background: '#FFFDE7', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#9C27B0', marginBottom: '20px' }}>Songs</h2>

        <form onSubmit={handleSearch}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>by Title</label>
            <input
              type="text"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>by Artist</label>
            <input
              type="text"
              value={filters.artist}
              onChange={(e) => setFilters({ ...filters, artist: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>by Year</label>
            <input
              type="text"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                background: '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              style={{
                flex: 1,
                padding: '10px',
                background: 'white',
                color: '#9C27B0',
                border: '2px solid #9C27B0',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel - Results */}
      <div style={{ flex: 1, background: '#FFFDE7', padding: '20px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Sort:</label>
            <select
              value={getSortValue()}
              onChange={handleSortChange}
              style={{
                padding: '6px 12px',
                border: '1px solid #9C27B0',
                borderRadius: '4px',
                color: '#9C27B0',
                cursor: 'pointer'
              }}
            >
              <option value="listen_count|DESC">Listens (Hi-Lo)</option>
              <option value="listen_count|ASC">Listens (Lo-Hi)</option>
              <option value="playlist_count|DESC">Playlists (Hi-Lo)</option>
              <option value="playlist_count|ASC">Playlists (Lo-Hi)</option>
              <option value="title|ASC">Title (A-Z)</option>
              <option value="title|DESC">Title (Z-A)</option>
              <option value="artist|ASC">Artist (A-Z)</option>
              <option value="artist|DESC">Artist (Z-A)</option>
              <option value="year|DESC">Year (Hi-Lo)</option>
              <option value="year|ASC">Year (Lo-Hi)</option>
            </select>
          </div>

          {user && (
            <button
              onClick={handleNewSong}
              style={{
                padding: '10px 20px',
                background: '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              New Song
            </button>
          )}
        </div>

        <div style={{ marginBottom: '16px', color: '#666' }}>
          {songs.length} Song{songs.length !== 1 ? 's' : ''}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
          {songs.map((song) => (
            <div
              key={song.id}
              style={{
                background: user && song.owner_id === user.id ? '#FFF9C4' : 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                  {song.title} by {song.artist} ({song.year})
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
                  <span>Listens: {song.listen_count || 0}</span>
                  <span>Playlists: {song.playlist_count || 0}</span>
                  <span>
                    YouTube ID:{' '}
                    <a
                      href={`https://www.youtube.com/watch?v=${song.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#9C27B0' }}
                    >
                      {song.youtube_id}
                    </a>
                  </span>
                </div>
              </div>

              {user && song.owner_id === user.id && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditSong(song)}
                    style={{
                      padding: '6px 12px',
                      background: '#9C27B0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSong(song.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#E91E63',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Song Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#90EE90',
              borderRadius: '8px',
              width: '500px',
              maxWidth: '90%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: '#228B22',
                color: 'white',
                padding: '12px 16px',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              {modalMode === 'add' ? 'Add Song' : 'Edit Song'}
            </div>

            <form onSubmit={handleSaveSong} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Artist</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>YouTube ID</label>
                <input
                  type="text"
                  value={formData.youtube_id}
                  onChange={(e) => setFormData({ ...formData, youtube_id: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    background: 'white',
                    color: '#228B22',
                    border: '2px solid #228B22',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#228B22',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Songs;
