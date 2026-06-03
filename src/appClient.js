/* Copyright (C) 2026 Tuumik Systems OÜ */

const APP_URL = process.env.APP_URL || 'http://app:3000';

async function request(apiKey, method, path, body, query) {
  const url = new URL(`${APP_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  const init = {
    method,
    headers: { 'x-api-key': apiKey, 'content-type': 'application/json' },
  };
  if (body !== undefined) init.body = JSON.stringify(body);

  const res = await fetch(url.toString(), init);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) {
    const msg = (data && data.error) ? data.error : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const appClient = {
  get: (apiKey, path, query) => request(apiKey, 'GET', path, undefined, query),
  post: (apiKey, path, body) => request(apiKey, 'POST', path, body),
  put: (apiKey, path, body) => request(apiKey, 'PUT', path, body),
  patch: (apiKey, path, body) => request(apiKey, 'PATCH', path, body),
  delete: (apiKey, path, body) => request(apiKey, 'DELETE', path, body),
};
