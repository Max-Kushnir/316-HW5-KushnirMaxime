import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/playlists');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>The Playlister</h1>
        <div style={styles.logo}>🎵</div>

        <div style={styles.buttons}>
          <button style={styles.button} onClick={() => navigate('/playlists')}>
            Continue as Guest
          </button>
          <button style={styles.button} onClick={() => navigate('/login')}>
            Login
          </button>
          <button style={styles.button} onClick={() => navigate('/register')}>
            Create Account
          </button>
        </div>
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
  },
  content: {
    background: '#FFFDE7',
    padding: '60px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '36px',
    color: '#333',
    marginBottom: '20px',
  },
  logo: {
    fontSize: '80px',
    marginBottom: '40px',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    background: '#333',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    minWidth: '200px',
  },
};

export default Welcome;
