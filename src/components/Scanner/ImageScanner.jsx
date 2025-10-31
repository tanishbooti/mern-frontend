import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, Upload, Loader2, Shield, AlertTriangle, CheckCircle, X, FileImage } from 'lucide-react';
import { checkScamImage } from '../../store/slices/scamSlice';

const ImageScanner = () => {
  const dispatch = useDispatch();
  const { loading, lastCheckResult, error } = useSelector((state) => state.scam);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      dispatch(checkScamImage(selectedFile));
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
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5" />;
      case 'safe':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
          <Image className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Scanner</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Upload screenshots of suspicious messages, emails, or documents to analyze</p>
        </div>
      </div>

      <div className="space-y-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />

          {!selectedFile ? (
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <Upload className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Drop an image here or click to browse</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Supports JPG, PNG, GIF up to 10MB</p>
                </div>
              </div>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-64 rounded-lg shadow-md" />
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                <FileImage className="h-4 w-4" />
                <span className="text-sm">{selectedFile.name}</span>
                <span className="text-xs">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            <span>{loading ? 'Analyzing...' : 'Analyze Image'}</span>
          </button>

          <button
            onClick={clearFile}
            disabled={!selectedFile}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

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

          {lastCheckResult.extractedText && (
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Extracted Text:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded font-mono">{lastCheckResult.extractedText}</p>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Analysis:</h4>
            <p className="text-gray-700 dark:text-gray-300">{lastCheckResult.explanation}</p>
          </div>

          {lastCheckResult.result === 'scam' && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border rounded-lg">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">🚨 Scam Content Detected!</h4>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                <li>• Do not follow any instructions in this image</li>
                <li>• Do not click any links mentioned</li>
                <li>• Do not provide personal information</li>
                <li>• Report this content to authorities</li>
                <li>• Delete the original message/email</li>
              </ul>
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

export default ImageScanner;
