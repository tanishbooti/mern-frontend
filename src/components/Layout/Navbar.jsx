import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Sun, Moon, User, LogOut, Menu, X } from 'lucide-react';
import { toggleTheme } from '../../store/slices/themeSlice';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/scan', label: 'Scan' },
    { path: '/history', label: 'History' },
    { path: '/watchlist', label: 'Watchlist' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/updates', label: 'Updates' },
  ];

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ScamGuard
              </span>
            </Link>
          </div>

          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <User className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium">
                  {user?.name || 'User'}
                </span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>

            
            <button
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium mb-1 ${
                  location.pathname === item.path
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
