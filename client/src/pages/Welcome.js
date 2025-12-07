import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If logged in, redirect to playlists
  if (user) {
    navigate('/playlists');
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      background: '#FFFDE7',
      margin: '20px',
      borderRadius: '8px',
      padding: '40px'
    }}>
      <h1 style={{ fontSize: '48px', color: '#9C27B0', marginBottom: '40px' }}>The Playlister</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link to="/playlists">
          <button style={{
            background: '#9C27B0',
            color: 'white',
            border: 'none',
            padding: '15px 40px',
            fontSize: '16px',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '200px'
          }}>
            Continue as Guest
          </button>
        </Link>
        <Link to="/login">
          <button style={{
            background: '#333',
            color: 'white',
            border: 'none',
            padding: '15px 40px',
            fontSize: '16px',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '200px'
          }}>
            Login
          </button>
        </Link>
        <Link to="/register">
          <button style={{
            background: '#333',
            color: 'white',
            border: 'none',
            padding: '15px 40px',
            fontSize: '16px',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '200px'
          }}>
            Create Account
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
