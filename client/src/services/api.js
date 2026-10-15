const API_BASE = '/api';

export async function fetchCandidates(search = '', status = 'All', profession = 'All') {
  const query = new URLSearchParams({ search, status, profession }).toString();
  const res = await fetch(`${API_BASE}/candidates?${query}`);
  return res.json();
}

export async function fetchCandidateById(id) {
  const res = await fetch(`${API_BASE}/candidates/${id}`);
  return res.json();
}

export async function createCandidate(data) {
  const res = await fetch(`${API_BASE}/candidates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateCandidateStatus(id, status) {
  const res = await fetch(`${API_BASE}/candidates/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
}

export async function fetchEmployerRequests() {
  const res = await fetch(`${API_BASE}/requests`);
  return res.json();
}

export async function createEmployerRequest(data) {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateRequestStatus(id, status) {
  const res = await fetch(`${API_BASE}/requests/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
}

export async function fetchJobs(category = 'All', search = '') {
  const query = new URLSearchParams({ category, search }).toString();
  const res = await fetch(`${API_BASE}/jobs?${query}`);
  return res.json();
}

export async function createJob(data) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchAdminStatus() {
  const res = await fetch(`${API_BASE}/admin/status`);
  return res.json();
}

export async function adminLogin(identifier, password) {
  // Support both (identifier, password) and single object ({ identifier, password })
  const payload = typeof identifier === 'object' ? identifier : { identifier, password };
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

