import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../services/api';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [avatarImage, setAvatarImage] = useState(user?.avatar_image || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password && password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (password && password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const data = { username, avatar_image: avatarImage };
      if (password) {
        data.password = password;
      }
      await usersApi.update(user.id, data);
      setSuccess(true);
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Update failed');
    }
  };

  const isValid = username && (!password || (password === passwordConfirm && password.length >= 8));

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>Edit Account</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && (
          <div style={styles.success}>Account updated! Logging out...</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Avatar Image (Base64 or URL)</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                style={styles.input}
                value={avatarImage}
                onChange={(e) => setAvatarImage(e.target.value)}
                placeholder="Optional"
              />
              {avatarImage && (
                <button
                  type="button"
                  style={styles.clearButton}
                  onClick={() => setAvatarImage('')}
                >
                  ⊗
                </button>
              )}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>User Name</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                style={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {username && (
                <button
                  type="button"
                  style={styles.clearButton}
                  onClick={() => setUsername('')}
                >
                  ⊗
                </button>
              )}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email (cannot be changed)</label>
            <input
              type="email"
              style={{ ...styles.input, background: '#f5f5f5' }}
              value={user.email}
              disabled
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password (leave blank to keep current)</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <button
                  type="button"
                  style={styles.clearButton}
                  onClick={() => setPassword('')}
                >
                  ⊗
                </button>
              )}
            </div>
          </div>

          {password && (
            <div style={styles.field}>
              <label style={styles.label}>Password Confirm</label>
              <div style={styles.inputWrapper}>
                <input
                  type="password"
                  style={styles.input}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                {passwordConfirm && (
                  <button
                    type="button"
                    style={styles.clearButton}
                    onClick={() => setPasswordConfirm('')}
                  >
                    ⊗
                  </button>
                )}
              </div>
            </div>
          )}

          <div style={styles.buttons}>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                background: isValid ? '#9C27B0' : '#ccc',
                cursor: isValid ? 'pointer' : 'not-allowed',
              }}
              disabled={!isValid}
            >
              Complete
            </button>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => navigate('/playlists')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 50px)',
    background: '#FFE4F3',
    padding: '20px',
  },
  content: {
    background: '#FFFDE7',
    padding: '40px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  error: {
    background: '#ffebee',
    color: '#D32F2F',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  success: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#666',
    fontSize: '14px',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '10px 40px 10px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  clearButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#999',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  submitButton: {
    flex: 1,
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '16px',
  },
  cancelButton: {
    flex: 1,
    background: '#fff',
    color: '#9C27B0',
    border: '2px solid #9C27B0',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Account;
