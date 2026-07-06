import { supabase } from './supabase';

const BASE = '/api';

async function getHeaders(json = true) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  const h = {};
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

async function request(method, path, body) {
  const headers = await getHeaders(!(body instanceof FormData));
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  // Projects
  getProjects: () => request('GET', '/projects'),
  getProject: (id) => request('GET', `/projects/${id}`),
  createProject: (name) => request('POST', '/projects', { name }),
  updateProject: (id, updates) => request('PATCH', `/projects/${id}`, updates),
  deleteProject: (id) => request('DELETE', `/projects/${id}`),

  // Upload
  uploadImages: (files) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    return request('POST', '/upload/image', fd);
  },
  uploadAudio: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('POST', '/upload/audio', fd);
  },
  uploadJson: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('POST', '/upload/json', fd);
  },

  // Render
  checkFfmpeg: () => request('GET', '/render/check'),
  startRender: (projectId) => request('POST', '/render/start', { projectId }),
  getRenderStatus: (jobId) => request('GET', `/render/status/${jobId}`),

  // Stripe
  createCheckout: (priceId) => request('POST', '/stripe/create-checkout', { priceId }),
  createPortal: () => request('POST', '/stripe/portal'),
};
