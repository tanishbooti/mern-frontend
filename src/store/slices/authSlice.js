import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';


const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(userData);
      return response.data.updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken;
      if (!refreshToken) throw new Error('No refresh token');

      const response = await authAPI.refreshToken(refreshToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.response?.data?.error || 'Token refresh failed');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;
