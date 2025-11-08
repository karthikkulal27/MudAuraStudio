import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to transform backend cart payload into flat items
const flatten = (items = []) => items.map(i => ({ ...i.product, quantity: i.quantity }));

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return []; // No remote cart when not logged in
  try {
    const res = await fetch(`${API_URL}/cart`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || 'Failed to load cart');
    return flatten(data.items);
  } catch (e) {
    return rejectWithValue(e.message || 'Network error');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ product, quantity = 1 }, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return { localOnly: true, product, quantity }; // local fallback
  try {
    const res = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId: product.id, quantity })
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || 'Failed to add item');
    return { items: flatten(data.items) };
  } catch (e) {
    return rejectWithValue(e.message || 'Network error');
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity }, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return { localOnly: true, productId, quantity };
  try {
    const res = await fetch(`${API_URL}/cart/items/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || 'Failed to update item');
    return { items: flatten(data.items) };
  } catch (e) {
    return rejectWithValue(e.message || 'Network error');
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (productId, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return { localOnly: true, productId };
  try {
    const res = await fetch(`${API_URL}/cart/items/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || 'Failed to remove item');
    return { items: flatten(data.items) };
  } catch (e) {
    return rejectWithValue(e.message || 'Network error');
  }
});

export const clearCartRemote = createAsyncThunk('cart/clearCartRemote', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return { localOnly: true };
  try {
    const res = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || 'Failed to clear cart');
    return { items: flatten(data.items) };
  } catch (e) {
    return rejectWithValue(e.message || 'Network error');
  }
});

const initialState = {
  items: [],
  total: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const qtyToAdd = action.payload.quantity && action.payload.quantity > 0 ? action.payload.quantity : 1;
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += qtyToAdd;
      } else {
        state.items.push({ ...action.payload, quantity: qtyToAdd });
      }
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        // If quantity is zero or less, remove the item
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== id);
        } else {
          item.quantity = quantity;
        }
        state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.total = state.items.reduce((t, i) => t + i.price * i.quantity, 0);
        }
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload?.localOnly) {
          const { product, quantity } = action.payload;
          const existing = state.items.find(i => i.id === product.id);
          if (existing) existing.quantity += quantity; else state.items.push({ ...product, quantity });
        } else if (action.payload?.items) {
          state.items = action.payload.items;
        }
        state.total = state.items.reduce((t, i) => t + i.price * i.quantity, 0);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (action.payload?.localOnly) {
          const { productId, quantity } = action.payload;
            const item = state.items.find(i => i.id === productId);
            if (item) {
              if (quantity <= 0) {
                state.items = state.items.filter(i => i.id !== productId);
              } else {
                item.quantity = quantity;
              }
            }
        } else if (action.payload?.items) {
          state.items = action.payload.items;
        }
        state.total = state.items.reduce((t, i) => t + i.price * i.quantity, 0);
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (action.payload?.localOnly) {
          const { productId } = action.payload;
          state.items = state.items.filter(i => i.id !== productId);
        } else if (action.payload?.items) {
          state.items = action.payload.items;
        }
        state.total = state.items.reduce((t, i) => t + i.price * i.quantity, 0);
      })
      .addCase(clearCartRemote.fulfilled, (state, action) => {
        if (action.payload?.localOnly) {
          state.items = [];
        } else if (action.payload?.items) {
          state.items = action.payload.items;
        }
        state.total = 0;
      });
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;