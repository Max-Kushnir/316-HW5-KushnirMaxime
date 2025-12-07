import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ background: '#FFE4F3', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<div>Welcome Page (TODO)</div>} />
              <Route path="/login" element={<div>Login Page (TODO)</div>} />
              <Route path="/register" element={<div>Register Page (TODO)</div>} />
              <Route path="/playlists" element={<div>Playlists Page (TODO)</div>} />
              <Route path="/songs" element={<div>Songs Page (TODO)</div>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
