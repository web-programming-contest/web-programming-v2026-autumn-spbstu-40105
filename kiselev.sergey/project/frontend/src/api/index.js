import {request} from './client.js';

export {ApiError} from './client.js';

export function login(credentials) {
  return request('/login', {method: 'POST', body: credentials});
}

export function logout() {
  return request('/logout', {method: 'POST'});
}

export function fetchCurrentUser() {
  return request('/me');
}

export function fetchGoods() {
  return request('/goods');
}

export function fetchOrders() {
  return request('/orders');
}

export function createOrder(order) {
  return request('/orders', {method: 'POST', body: order});
}
