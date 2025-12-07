const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

// Auth API
export const authApi = {
  register: async (email, username, password, avatar_image) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, avatar_image })
    });
    return handleResponse(res);
  },

  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  me: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};

// Users API
export const usersApi = {
  getById: async (id) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  }
};

// Songs API
export const songsApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    const res = await fetch(`${API_URL}/songs${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/songs/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/songs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/songs/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};

// Playlists API
export const playlistsApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    const res = await fetch(`${API_URL}/playlists${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/playlists/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  create: async (data = {}) => {
    const res = await fetch(`${API_URL}/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/playlists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/playlists/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  copy: async (id) => {
    const res = await fetch(`${API_URL}/playlists/${id}/copy`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  listen: async (id, listenerIdentifier) => {
    const res = await fetch(`${API_URL}/playlists/${id}/listen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ listenerIdentifier })
    });
    return handleResponse(res);
  },

  addSong: async (playlistId, songId) => {
    const res = await fetch(`${API_URL}/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ songId })
    });
    return handleResponse(res);
  },

  removeSong: async (playlistId, songId) => {
    const res = await fetch(`${API_URL}/playlists/${playlistId}/songs/${songId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  reorderSongs: async (playlistId, songIds) => {
    const res = await fetch(`${API_URL}/playlists/${playlistId}/songs/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ songIds })
    });
    return handleResponse(res);
  }
};
