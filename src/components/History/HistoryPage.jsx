import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History, Search, Filter, Calendar, FileText, Globe, Phone, Image, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { getScamHistory } from '../../store/slices/scamSlice';
import LoadingSpinner from '../UI/LoadingSpinner';

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.scam);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const [filterResult, setFilterResult] = React.useState('all');

  React.useEffect(() => {
    dispatch(getScamHistory());
  }, [dispatch]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'url':
        return <Globe className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'scam':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'safe':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'scam':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'suspicious':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'safe':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.sourceType === filterType;
    const matchesResult = filterResult === 'all' || item.result === filterResult;

    return matchesSearch && matchesType && matchesResult;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
          <History className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scan History</h1>
          <p className="text-gray-600 dark:text-gray-400">View your previous scam detection results</p>
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Search content or explanations..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">All Types</option>
                <option value="text">Text</option>
                <option value="url">URL</option>
                <option value="phone">Phone</option>
                <option value="image">Image</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">All Results</option>
                <option value="safe">Safe</option>
                <option value="suspicious">Suspicious</option>
                <option value="scam">Scam</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterType !== 'all' || filterResult !== 'all'
                ? 'No results found'
                : 'No scan history yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterType !== 'all' || filterResult !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Start scanning content to see your history here'}
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">{getTypeIcon(item.sourceType)}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{item.sourceType} Scan</span>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getResultColor(item.result)}`}>
                        {getResultIcon(item.result)}
                        <span className="capitalize">{item.result}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Scanned Content:</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg break-words">
                    {item.content.length > 200 ? `${item.content.substring(0, 200)}...` : item.content}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Analysis:</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.explanation}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredHistory.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredHistory.length} of {history.length} scans
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
