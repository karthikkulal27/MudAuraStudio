import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';

// Load persisted cart only; auth will hydrate via fetchMe on app mount
const loadState = () => {
  try {
    const cartSerialized = localStorage.getItem('cart');
    if (cartSerialized) return { cart: JSON.parse(cartSerialized) };
    return undefined;
  } catch (e) {
    console.warn('Failed to load cart from localStorage', e);
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productsReducer,
  },
  preloadedState,
});

// Persist cart to localStorage on changes
store.subscribe(() => {
  try {
    const state = store.getState();
    const serialized = JSON.stringify(state.cart);
    localStorage.setItem('cart', serialized);
  } catch (e) {
    console.warn('Failed to save cart to localStorage', e);
  }
});