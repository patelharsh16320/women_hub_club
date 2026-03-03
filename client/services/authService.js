import { fetchAPI } from './api';

export async function signupUser(data) {
  return fetchAPI('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logoutUser() {
  return fetchAPI('/auth/logout', { method: 'POST' });
}
