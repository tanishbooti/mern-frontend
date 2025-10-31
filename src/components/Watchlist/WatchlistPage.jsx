import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Shield, Plus, Trash2, Search, Phone, Globe, Mail, AlertTriangle, Calendar } from 'lucide-react';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../../store/slices/scamSlice';
import LoadingSpinner from '../UI/LoadingSpinner';

const WatchlistPage = () => {
  const dispatch = useDispatch();
  const { watchlist, loading } = useSelector((state) => state.scam);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(getWatchlist());
  }, [dispatch]);

  const onSubmit = async (data) => {
    await dispatch(addToWatchlist(data));
    reset();
    setShowAddForm(false);
  };

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this entry from your watchlist?')) {
      dispatch(removeFromWatchlist(id));
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'url':
        return <Globe className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'phone':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300';
      case 'url':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      case 'email':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300';
    }
  };

  const filteredWatchlist = watchlist.filter((item) => {
    const matchesSearch = item.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Watchlist</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your list of reported scam numbers, URLs, and emails
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Entry</span>
        </button>
      </div>

      
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add to Watchlist</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <select
                  {...register('type', { required: 'Type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select type</option>
                  <option value="phone">Phone Number</option>
                  <option value="url">URL/Website</option>
                  <option value="email">Email Address</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Value</label>
                <input
                  {...register('value', { required: 'Value is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter phone number, URL, or email"
                />
                {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Add Entry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    reset();
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Search watchlist entries..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="phone">Phone Numbers</option>
              <option value="url">URLs</option>
              <option value="email">Email Addresses</option>
            </select>
          </div>
        </div>
      </div>

      
      <div className="space-y-4">
        {filteredWatchlist.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterType !== 'all' ? 'No entries found' : 'No watchlist entries yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Add suspicious numbers, URLs, or emails to your watchlist'}
            </p>
          </div>
        ) : (
          filteredWatchlist.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>{getTypeIcon(item.type)}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>Added {new Date(item.dateAdded).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remove from watchlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredWatchlist.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredWatchlist.length} of {watchlist.length} entries
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
