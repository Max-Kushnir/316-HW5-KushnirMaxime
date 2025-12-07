import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <button
          style={styles.homeButton}
          onClick={() => navigate(isAuthenticated ? '/playlists' : '/')}
        >
          🏠
        </button>
        <button style={styles.navButton} onClick={() => navigate('/playlists')}>
          Playlists
        </button>
        <button style={styles.navButton} onClick={() => navigate('/songs')}>
          Song Catalog
        </button>
      </div>

      <div style={styles.center}>
        {isAuthenticated && <h1 style={styles.title}>The Playlister</h1>}
      </div>

      <div style={styles.right}>
        <div style={{ position: 'relative' }}>
          <button
            style={styles.accountButton}
            onClick={() => setShowMenu(!showMenu)}
          >
            {user?.avatar_image ? (
              <img src={user.avatar_image} alt="Avatar" style={styles.avatar} />
            ) : (
              '👤'
            )}
          </button>

          {showMenu && (
            <div style={styles.dropdown}>
              {isAuthenticated ? (
                <>
                  <div style={styles.menuItem} onClick={() => { navigate('/account'); setShowMenu(false); }}>
                    Edit Account
                  </div>
                  <div style={styles.menuItem} onClick={handleLogout}>
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.menuItem} onClick={() => { navigate('/login'); setShowMenu(false); }}>
                    Login
                  </div>
                  <div style={styles.menuItem} onClick={() => { navigate('/register'); setShowMenu(false); }}>
                    Create Account
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    height: '50px',
    background: '#FF00FF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
  },
  left: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    textAlign: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
  },
  homeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #FF00FF',
    background: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
  },
  navButton: {
    background: '#7B1FA2',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  title: {
    color: '#fff',
    margin: 0,
    fontSize: '24px',
  },
  accountButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  dropdown: {
    position: 'absolute',
    top: '45px',
    right: 0,
    background: '#E1BEE7',
    border: '2px dashed #9C27B0',
    borderRadius: '4px',
    minWidth: '150px',
    zIndex: 1000,
  },
  menuItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;
