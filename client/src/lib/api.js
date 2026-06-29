const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${SERVER_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), data);
  return data;
}

export const api = {
  // Create a new room; password is optional
  createRoom: (name, password) =>
    request('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({ name, ...(password ? { password } : {}) }),
    }),

  // Get public room info without joining (name + isPasswordProtected)
  getRoomInfo: (code) => request(`/api/rooms/${code}`),

  // Verify room password → returns { roomToken }
  authRoom: (code, password) =>
    request(`/api/rooms/${code}/auth`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  // Join a room; pass roomToken for protected rooms, hostToken for hosts
  joinRoom: (code, { roomToken, hostToken } = {}) =>
    request(`/api/rooms/${code}/join`, {
      method: 'POST',
      body: JSON.stringify({ roomToken, hostToken }),
    }),

  // Host-only: rename room, set/change/remove password
  updateRoom: (code, hostToken, updates) =>
    request(`/api/rooms/${code}`, {
      method: 'PATCH',
      body: JSON.stringify({ hostToken, ...updates }),
    }),
};
