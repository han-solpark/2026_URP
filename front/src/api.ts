const BASE = 'http://localhost:8000';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
});

const plainHeaders = () => ({
  'Content-Type': 'application/json',
});

export const api = {
  get: (path: string) =>
    fetch(`${BASE}${path}`, { headers: authHeaders() }).then(r => r.json()),

  post: (path: string, body: object) =>
    fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(r => r.json()),

  postNoAuth: (path: string, body: object) =>
    fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: plainHeaders(),
      body: JSON.stringify(body),
    }).then(r => r.json()),

  put: (path: string, body: object) =>
    fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(r => r.json()),

  delete: (path: string) =>
    fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(r => r.json()),
};
