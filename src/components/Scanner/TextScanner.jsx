import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Loader2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { checkScamText } from '../../store/slices/scamSlice';

const TextScanner = () => {
  const dispatch = useDispatch();
  const { loading, lastCheckResult, error } = useSelector((state) => state.scam);
  
  const { register, handleSubmit, watch, reset } = useForm();
  const watchedText = watch('text', '');

  const onSubmit = async (data) => {
    if (data.text.trim()) {
      dispatch(checkScamText(data.text));
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

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Text Scanner
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Paste suspicious messages, emails, or text content to analyze for scams
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text to Analyze
          </label>
          <textarea
            {...register('text', { required: true })}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Paste the suspicious text, email, or message content here..."
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Enter text to analyze for potential scams</span>
            <span>{watchedText.length} characters</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading || !watchedText.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            <span>{loading ? 'Analyzing...' : 'Analyze Text'}</span>
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
                Analysis Result: {lastCheckResult.result.charAt(0).toUpperCase() + lastCheckResult.result.slice(1)}
              </h3>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Explanation:</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {lastCheckResult.explanation}
            </p>
          </div>

          {lastCheckResult.result === 'scam' && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">⚠️ Scam Detected!</h4>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                <li>• Do not click any links or download attachments</li>
                <li>• Do not provide personal information</li>
                <li>• Report this content to relevant authorities</li>
                <li>• Block the sender if possible</li>
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

export default TextScanner;
