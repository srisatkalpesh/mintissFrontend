import { ref } from 'vue';

// reactive token and user info store
export const token = ref(localStorage.getItem('token') || null);
export const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

export function setToken(newToken) {
  token.value = newToken;
  localStorage.setItem('token', newToken);
}

export function setUser(newUser) {
  user.value = newUser;
  localStorage.setItem('user', JSON.stringify(newUser));
}

export function clearAuth() {
  token.value = null;
  user.value = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
