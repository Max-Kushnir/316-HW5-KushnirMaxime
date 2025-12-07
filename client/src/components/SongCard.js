import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SongCard = ({ song, onEdit, onDelete, onAddToPlaylist, userPlaylists = [] }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const isOwner = user?.id === song.owner_id;

  return (
    <div style={{
      ...styles.card,
      background: isOwner ? '#FFF9C4' : '#fff',
    }}>
      <div style={styles.header}>
        <div style={styles.info}>
          <div style={styles.title}>
            {song.title} by {song.artist} ({song.year})
          </div>
          <div style={styles.stats}>
            <span>Listens: {song.listen_count || 0}</span>
            <span style={{ marginLeft: '20px' }}>
              Playlists: {song.playlist_count || 0}
            </span>
          </div>
        </div>

        {user && (
          <div style={{ position: 'relative' }}>
            <button
              style={styles.menuButton}
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋮
            </button>

            {showMenu && (
              <div style={styles.dropdown}>
                <div
                  style={styles.menuItem}
                  onMouseEnter={() => setShowPlaylistMenu(true)}
                  onMouseLeave={() => setShowPlaylistMenu(false)}
                >
                  Add to Playlist
                  {showPlaylistMenu && userPlaylists.length > 0 && (
                    <div style={styles.submenu}>
                      {userPlaylists.map((playlist) => (
                        <div
                          key={playlist.id}
                          style={styles.submenuItem}
                          onClick={() => {
                            onAddToPlaylist(song, playlist);
                            setShowMenu(false);
                            setShowPlaylistMenu(false);
                          }}
                        >
                          {playlist.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isOwner && (
                  <>
                    <div
                      style={styles.menuItem}
                      onClick={() => {
                        onEdit(song);
                        setShowMenu(false);
                      }}
                    >
                      Edit Song
                    </div>
                    <div
                      style={styles.menuItem}
                      onClick={() => {
                        onDelete(song);
                        setShowMenu(false);
                      }}
                    >
                      Remove from Catalog
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '6px',
  },
  stats: {
    fontSize: '14px',
    color: '#666',
  },
  menuButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 8px',
  },
  dropdown: {
    position: 'absolute',
    top: '25px',
    right: 0,
    background: '#E1BEE7',
    border: '2px dashed #9C27B0',
    borderRadius: '4px',
    minWidth: '150px',
    zIndex: 100,
  },
  menuItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    position: 'relative',
  },
  submenu: {
    position: 'absolute',
    top: 0,
    right: '100%',
    background: '#FFCDD2',
    border: '1px solid #9C27B0',
    borderRadius: '4px',
    minWidth: '150px',
  },
  submenuItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default SongCard;
