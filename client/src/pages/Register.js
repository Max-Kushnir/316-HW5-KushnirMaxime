import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register({ email, username, password });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const clearEmail = () => setEmail('');
  const clearUsername = () => setUsername('');
  const clearPassword = () => setPassword('');
  const clearPasswordConfirm = () => setPasswordConfirm('');

  const isFormValid =
    email &&
    username &&
    password.length >= 8 &&
    password === passwordConfirm;

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Create Account</h1>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your email"
              />
              {email && (
                <button
                  type="button"
                  onClick={clearEmail}
                  style={styles.clearButton}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your username"
              />
              {username && (
                <button
                  type="button"
                  onClick={clearUsername}
                  style={styles.clearButton}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your password (min 8 characters)"
              />
              {password && (
                <button
                  type="button"
                  onClick={clearPassword}
                  style={styles.clearButton}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                style={styles.input}
                placeholder="Confirm your password"
              />
              {passwordConfirm && (
                <button
                  type="button"
                  onClick={clearPasswordConfirm}
                  style={styles.clearButton}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            style={{
              ...styles.submitButton,
              opacity: !isFormValid ? 0.5 : 1,
              cursor: !isFormValid ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    padding: '20px',
  },
  formCard: {
    background: '#FFFDE7',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: '#333',
    fontSize: '28px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    color: '#333',
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px',
    paddingRight: '40px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  clearButton: {
    position: 'absolute',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    color: '#999',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    background: '#9C27B0',
    color: '#333',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s, opacity 0.2s',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#333',
    fontSize: '14px',
  },
  link: {
    color: '#9C27B0',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Register;
