import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertTriangle, Info, AlertCircle, Calendar, Search, Filter } from 'lucide-react';
import { getScamUpdates } from '../../store/slices/scamSlice';
import LoadingSpinner from '../UI/LoadingSpinner';

const UpdatesPage = () => {
  const dispatch = useDispatch();
  const { updates, loading } = useSelector((state) => state.scam);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    dispatch(getScamUpdates());
  }, [dispatch]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getCardBorderColor = (type) => {
    switch (type) {
      case 'alert':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const filteredUpdates = updates.filter((update) => {
    const matchesSearch =
      update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || update.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
          <AlertTriangle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scam Updates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay informed about the latest scam threats and security alerts
          </p>
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Updates
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Search by title or description..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Type
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">All Types</option>
                <option value="alert">Critical Alerts</option>
                <option value="warning">Warnings</option>
                <option value="info">Information</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      
      <div className="space-y-6">
        {filteredUpdates.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterType !== 'all' ? 'No updates found' : 'No updates available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Check back later for the latest scam alerts and security updates'}
            </p>
          </div>
        ) : (
          filteredUpdates.map((update) => (
            <div
              key={update._id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 ${getCardBorderColor(update.type)} p-6`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${getTypeColor(update.type)}`}>
                  {getTypeIcon(update.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {update.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(update.type)}`}
                    >
                      {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {update.description}
                  </p>

                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Published{' '}
                      {new Date(update.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              
              {update.type === 'alert' && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">🚨 Immediate Action Required</h4>
                  <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                    <li>• Review your recent communications for similar threats</li>
                    <li>• Update your security settings and passwords</li>
                    <li>• Share this alert with friends and family</li>
                    <li>• Report any encounters to authorities</li>
                  </ul>
                </div>
              )}

              {update.type === 'warning' && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Stay Vigilant</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Be extra cautious of similar scam attempts and verify any suspicious communications independently.
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {filteredUpdates.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredUpdates.length} of {updates.length} updates
        </div>
      )}
    </div>
  );
};

export default UpdatesPage;
