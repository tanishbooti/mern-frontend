import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import { setTheme } from './store/slices/themeSlice';
import { getUserProfile } from './store/slices/authSlice';


import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ScannerPage from './components/Scanner/ScannerPage';
import HistoryPage from './components/History/HistoryPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import WatchlistPage from './components/Watchlist/WatchlistPage';
import UpdatesPage from './components/Updates/UpdatesPage';
import ProfilePage from './components/Profile/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setTheme(isDark));

    if (isAuthenticated && accessToken) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isDark, isAuthenticated, accessToken]);

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'dark bg-gray-900' : 'bg-gray-50'
      }`}>
        <Navbar />
        <Routes>
          
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
          />

          
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route 
            path="/scan" 
            element={<ProtectedRoute><ScannerPage /></ProtectedRoute>}
          />
          <Route 
            path="/history" 
            element={<ProtectedRoute><HistoryPage /></ProtectedRoute>}
          />
          <Route 
            path="/analytics" 
            element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>}
          />
          <Route 
            path="/watchlist" 
            element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>}
          />
          <Route 
            path="/updates" 
            element={<ProtectedRoute><UpdatesPage /></ProtectedRoute>}
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />

          
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
