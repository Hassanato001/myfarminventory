const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthState() {
  return {
    accessToken: localStorage.getItem('farmshop_access_token') || '',
    refreshToken: localStorage.getItem('farmshop_refresh_token') || ''
  };
}

function setAuthState({ accessToken, refreshToken, user } = {}) {
  if (accessToken !== undefined) {
    if (accessToken) {
      localStorage.setItem('farmshop_access_token', accessToken);
    } else {
      localStorage.removeItem('farmshop_access_token');
    }
  }

  if (refreshToken !== undefined) {
    if (refreshToken) {
      localStorage.setItem('farmshop_refresh_token', refreshToken);
    } else {
      localStorage.removeItem('farmshop_refresh_token');
    }
  }

  if (user !== undefined) {
    if (user) {
      localStorage.setItem('farmshop_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('farmshop_user');
    }
  }

  window.dispatchEvent(new Event('farmshop-auth-changed'));
}

async function parseJson(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON response from server');
  }
}

async function refreshAccessToken() {
  const { refreshToken } = getAuthState();
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });

  const data = await parseJson(response);
  if (!response.ok) {
    return null;
  }

  setAuthState({
    accessToken: data?.data?.accessToken || '',
    refreshToken: data?.data?.refreshToken || ''
  });

  return data?.data?.accessToken || null;
}

async function request(path, options = {}, retry = true) {
  const { accessToken } = getAuthState();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });

  const data = await parseJson(response);

  if (response.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request(path, options, false);
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export { API_BASE_URL, request, setAuthState, getAuthState };
