import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Globe, Loader2, Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { checkScamUrl } from '../../store/slices/scamSlice';

const UrlScanner = () => {
  const dispatch = useDispatch();
  const { loading, lastCheckResult, error } = useSelector((state) => state.scam);
  
  const { register, handleSubmit, watch, reset } = useForm();
  const watchedUrl = watch('url', '');

  const onSubmit = async (data) => {
    if (data.url.trim()) {
      dispatch(checkScamUrl(data.url));
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'scam':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'suspicious':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'safe':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'scam':
        return <AlertTriangle className="h-5 w-5" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5" />;
      case 'safe':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <Globe className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            URL Scanner
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check if a website or link is safe before visiting
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL to Check
          </label>
          <div className="relative">
            <input
              {...register('url', { required: true })}
              type="text"
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="https://example.com or example.com"
            />
            <Globe className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Enter the full URL or domain name
            </span>
            {watchedUrl && !isValidUrl(watchedUrl) && (
              <span className="text-sm text-red-500">Invalid URL format</span>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading || !watchedUrl.trim() || !isValidUrl(watchedUrl)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            <span>{loading ? 'Checking...' : 'Check URL'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {lastCheckResult && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${getResultColor(lastCheckResult.result)}`}>
              {getResultIcon(lastCheckResult.result)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                URL Status: {lastCheckResult.result.charAt(0).toUpperCase() + lastCheckResult.result.slice(1)}
              </h3>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Analysis:</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {lastCheckResult.explanation}
            </p>
          </div>

          {lastCheckResult.result === 'safe' && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">✅ URL appears safe</h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    This URL passed our security checks, but always exercise caution online.
                  </p>
                </div>
                <a
                  href={watchedUrl.startsWith('http') ? watchedUrl : `https://${watchedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Visit</span>
                </a>
              </div>
            </div>
          )}

          {(lastCheckResult.result === 'scam' || lastCheckResult.result === 'suspicious') && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                {lastCheckResult.result === 'scam' ? '🚨 Dangerous URL!' : '⚠️ Suspicious URL!'}
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                <li>• Do not visit this website</li>
                <li>• Do not enter any personal information</li>
                <li>• Do not download anything from this site</li>
                <li>• Report this URL to authorities</li>
                <li>• Warn others about this link</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UrlScanner;
