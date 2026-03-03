// Utility to get/set/clear cart for the current user
export function getCartKey(user) {
  return user && user.email ? `cart_${user.email}` : 'cart';
}

export function getUserCart(user) {
  const cartKey = getCartKey(user);
  try {
    const raw = localStorage.getItem(cartKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearUserCart(user) {
  const cartKey = getCartKey(user);
  localStorage.removeItem(cartKey);
  try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } })); } catch (e) {}
}

export function setUserCart(user, cart) {
  const cartKey = getCartKey(user);
  localStorage.setItem(cartKey, JSON.stringify(cart));
  try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } })); } catch (e) {}
}
