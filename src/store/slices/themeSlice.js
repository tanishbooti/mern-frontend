import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  return true; 
};

const initialState = {
  isDark: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', state.isDark);
    },
    setTheme: (state, action) => {
      state.isDark = action.payload;
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', state.isDark);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
