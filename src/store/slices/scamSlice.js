import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scamAPI } from '../../services/api';


const initialState = {
  history: [],
  updates: [],
  watchlist: [],
  analytics: null,
  loading: false,
  error: null,
  lastCheckResult: null,
};


export const checkScamText = createAsyncThunk(
  'scam/checkText',
  async (text, { rejectWithValue }) => {
    try {
      const response = await scamAPI.checkText(text);
      return response.data.scamResult;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to check text');
    }
  }
);

export const checkScamUrl = createAsyncThunk(
  'scam/checkUrl',
  async (url, { rejectWithValue }) => {
    try {
      const response = await scamAPI.checkUrl(url);
      return response.data.scamResult;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to check URL');
    }
  }
);

export const checkScamImage = createAsyncThunk(
  'scam/checkImage',
  async (file, { rejectWithValue }) => {
    try {
      const response = await scamAPI.checkImage(file);
      return response.data.scamResult;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to check image');
    }
  }
);

export const checkPhoneNumber = createAsyncThunk(
  'scam/checkPhone',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await scamAPI.checkPhone(phoneNumber);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to check phone number');
    }
  }
);

export const getScamHistory = createAsyncThunk(
  'scam/getHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scamAPI.getHistory();
      return response.data.history;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch history');
    }
  }
);

export const getScamUpdates = createAsyncThunk(
  'scam/getUpdates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scamAPI.getUpdates();
      return response.data.updates;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch updates');
    }
  }
);

export const getWatchlist = createAsyncThunk(
  'scam/getWatchlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scamAPI.getWatchlist();
      return response.data.watchlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch watchlist');
    }
  }
);

export const getAnalytics = createAsyncThunk(
  'scam/getAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scamAPI.getAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch analytics');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'scam/addToWatchlist',
  async ({ value, type }, { rejectWithValue }) => {
    try {
      const response = await scamAPI.addToWatchlist(value, type);
      return response.data.entry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'scam/removeFromWatchlist',
  async (id, { rejectWithValue }) => {
    try {
      await scamAPI.removeFromWatchlist(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove from watchlist');
    }
  }
);


const scamSlice = createSlice({
  name: 'scam',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastResult: (state) => {
      state.lastCheckResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkScamText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkScamText.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCheckResult = action.payload;
      })
      .addCase(checkScamText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkScamUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkScamUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCheckResult = action.payload;
      })
      .addCase(checkScamUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkScamImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkScamImage.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCheckResult = action.payload;
      })
      .addCase(checkScamImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkPhoneNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPhoneNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCheckResult = action.payload;
      })
      .addCase(checkPhoneNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getScamHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(getScamUpdates.fulfilled, (state, action) => {
        state.updates = action.payload;
      })
      .addCase(getWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.watchlist.unshift(action.payload);
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.watchlist = state.watchlist.filter(item => item._id !== action.payload);
      });
  },
});

export const { clearError, clearLastResult } = scamSlice.actions;
export default scamSlice.reducer;
