import { fetchAPI } from './api';

export async function getUserById(id) {
  return fetchAPI(`/users/${id}`);
}
