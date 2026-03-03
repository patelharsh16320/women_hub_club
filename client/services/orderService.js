import { fetchAPI } from './api';

export async function createOrder(data) {
  return fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrders(userId) {
  return fetchAPI(`/orders${userId ? `?userId=${userId}` : ''}`);
}

export async function getOrderById(id) {
  return fetchAPI(`/orders/${id}`);
}
