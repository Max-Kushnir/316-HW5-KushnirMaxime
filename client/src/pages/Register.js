import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [avatarImage, setAvatarImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await register(email, username, password, avatarImage);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const isValid =
    email && username && password && passwordConfirm && password === passwordConfirm && password.length >= 8;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && (
          <div style={styles.success}>Account created! Redirecting to login...</div>
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
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {email && (
                <button
                  type="button"
                  style={styles.clearButton}
                  onClick={() => setEmail('')}
                >
                  ⊗
                </button>
              )}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <div style={styles.field}>
            <label style={styles.label}>Password Confirm</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                style={styles.input}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
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

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              background: isValid ? '#333' : '#ccc',
              cursor: isValid ? 'pointer' : 'not-allowed',
            }}
            disabled={!isValid}
          >
            Create Account
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{' '}
          <span style={styles.link} onClick={() => navigate('/login')}>
            Sign In
          </span>
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
  submitButton: {
    width: '100%',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '16px',
    marginTop: '10px',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
  },
  link: {
    color: '#9C27B0',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Register;
