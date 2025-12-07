import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PlaylistCard = ({ playlist, onEdit, onDelete, onCopy, onPlay }) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const isOwner = user?.id === playlist.owner_id;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.left}>
          {playlist.owner?.avatar_image && (
            <img
              src={playlist.owner.avatar_image}
              alt="Avatar"
              style={styles.avatar}
            />
          )}
          <div>
            <div style={styles.name}>{playlist.name}</div>
            <div style={styles.username}>{playlist.owner?.username}</div>
          </div>
        </div>

        <div style={styles.actions}>
          {isOwner && (
            <>
              <button style={styles.deleteButton} onClick={() => onDelete(playlist)}>
                Delete
              </button>
              <button style={styles.editButton} onClick={() => onEdit(playlist)}>
                Edit
              </button>
            </>
          )}
          {user && (
            <button style={styles.copyButton} onClick={() => onCopy(playlist)}>
              Copy
            </button>
          )}
          <button style={styles.playButton} onClick={() => onPlay(playlist)}>
            Play
          </button>
          <button style={styles.expandButton} onClick={() => setExpanded(!expanded)}>
            {expanded ? '∧' : '∨'}
          </button>
        </div>
      </div>

      {expanded && playlist.songs && playlist.songs.length > 0 && (
        <div style={styles.songsList}>
          {playlist.songs.map((song, index) => (
            <div key={song.id} style={styles.songItem}>
              {index + 1}. {song.title} by {song.artist} ({song.year})
            </div>
          ))}
        </div>
      )}

      <div style={styles.listeners}>{playlist.listener_count || 0} Listeners</div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  name: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  username: {
    fontSize: '14px',
    color: '#666',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  deleteButton: {
    background: '#E91E63',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  editButton: {
    background: '#9C27B0',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  copyButton: {
    background: '#9C27B0',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  playButton: {
    background: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  expandButton: {
    background: '#9C27B0',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  songsList: {
    marginTop: '12px',
    paddingLeft: '60px',
    background: '#f5f5f5',
    padding: '12px',
    borderRadius: '4px',
  },
  songItem: {
    fontSize: '14px',
    marginBottom: '6px',
  },
  listeners: {
    color: '#9C27B0',
    fontSize: '14px',
    marginTop: '8px',
  },
};

export default PlaylistCard;
