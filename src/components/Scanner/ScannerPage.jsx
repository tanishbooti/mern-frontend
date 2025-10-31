import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Scan, Globe, Phone, Image, FileText } from 'lucide-react';
import TextScanner from './TextScanner';
import UrlScanner from './UrlScanner';
import PhoneScanner from './PhoneScanner';
import ImageScanner from './ImageScanner';

const ScannerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('type') || 'text';

  const tabs = [
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'url', label: 'URL', icon: Globe },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'image', label: 'Image', icon: Image },
  ];

  const setActiveTab = (tab) => {
    setSearchParams({ type: tab });
  };

  const renderScanner = () => {
    switch (activeTab) {
      case 'text':
        return <TextScanner />;
      case 'url':
        return <UrlScanner />;
      case 'phone':
        return <PhoneScanner />;
      case 'image':
        return <ImageScanner />;
      default:
        return <TextScanner />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
            <Scan className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Scam Scanner
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Protect yourself by scanning suspicious content before interacting with it
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {renderScanner()}
      </div>
    </div>
  );
};

export default ScannerPage;
