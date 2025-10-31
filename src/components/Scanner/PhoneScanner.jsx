import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Phone, Loader2, Shield, AlertTriangle, CheckCircle, UserX } from 'lucide-react';
import { checkPhoneNumber } from '../../store/slices/scamSlice';

const PhoneScanner = () => {
  const dispatch = useDispatch();
  const { loading, lastCheckResult, error } = useSelector((state) => state.scam);

  const { register, handleSubmit, watch, reset } = useForm();
  const watchedPhone = watch('phoneNumber', '');

  const onSubmit = (data) => {
    if (data.phoneNumber.trim()) {
      dispatch(checkPhoneNumber(data.phoneNumber));
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
        return <UserX className="h-5 w-5" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5" />;
      case 'safe':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 10) {
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <Phone className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Phone Number Scanner</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Check if a phone number has been reported for scam activities</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              {...register('phoneNumber', { required: true })}
              type="tel"
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="+1 (555) 123-4567 or 5551234567"
            />
            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter the phone number with or without country code
            {watchedPhone && (
              <div className="mt-1 text-gray-700 dark:text-gray-300">
                Formatted: {formatPhoneNumber(watchedPhone)}
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading || !watchedPhone.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            <span>{loading ? 'Checking...' : 'Check Number'}</span>
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
      </form>

      {lastCheckResult && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${getResultColor(lastCheckResult.result)}`}>
              {getResultIcon(lastCheckResult.result)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Number Status: {lastCheckResult.result.charAt(0).toUpperCase() + lastCheckResult.result.slice(1)}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Analysis:</h4>
            <p className="text-gray-700 dark:text-gray-300">{lastCheckResult.explanation}</p>
          </div>

          {lastCheckResult.result === 'scam' && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border rounded-lg">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">🚨 Scam Number Detected!</h4>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                <li>• Do not answer calls from this number</li>
                <li>• Do not provide any personal information</li>
                <li>• Block this number on your device</li>
                <li>• Report to your phone carrier</li>
                <li>• Warn friends and family</li>
              </ul>
            </div>
          )}

          {lastCheckResult.result === 'suspicious' && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Suspicious Activity</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <li>• Exercise caution when answering</li>
                <li>• Never give out personal information</li>
                <li>• Verify caller identity independently</li>
                <li>• Consider blocking if unwanted</li>
              </ul>
            </div>
          )}

          {lastCheckResult.result === 'safe' && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">✅ No Issues Found</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                This number hasn't been reported for scam activities. However, always verify caller identity before sharing personal information.
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border rounded-lg">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PhoneScanner;
