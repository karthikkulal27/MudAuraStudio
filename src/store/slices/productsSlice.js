import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Use relative /api for dev (proxied by Vite) to preserve cookies; fall back to VITE_API_URL if defined
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.set('category', params.category);
      if (params.search) query.set('search', params.search);
      if (params.featured !== undefined) query.set('featured', params.featured);
      const url = `${API_URL}/products${query.toString() ? `?${query}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to fetch products');
      return data.products || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to fetch product');
      return data.product;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to create product');
      return data.product;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to update product');
      return data.product;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        return rejectWithValue(data.error || 'Failed to delete product');
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'latest',
  },
  byId: {},
  productLoading: false,
  productError: null,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        const product = action.payload;
        state.byId[product.id] = product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })
      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.byId[action.payload.id] = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map(p => p.id === updated.id ? updated : p);
        state.byId[updated.id] = updated;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(p => p.id !== id);
        delete state.byId[id];
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { setFilters } = productsSlice.actions;

export default productsSlice.reducer;