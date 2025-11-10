import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser } from '../../utils/auth';
import { hydrateCart } from './cartSlice';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;

// Thunks
export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const user = await getCurrentUser();
    return user; // null if not logged in
  } catch (e) {
    return rejectWithValue(e.message || 'Failed to fetch user');
  }
});

// After a successful loginSuccess dispatch from UI, trigger hydration
export const loginAndHydrate = (credentials, loginFn) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const user = await loginFn(credentials);
    dispatch(loginSuccess(user));
    // hydrate cart in background
    dispatch(hydrateCart());
    return user;
  } catch (e) {
    const msg = e.message || 'Login failed';
    dispatch(loginFailure(msg));
    throw e;
  }
};