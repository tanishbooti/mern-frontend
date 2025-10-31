import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp, Shield, AlertTriangle, BarChart3, PieChart, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,  
} from 'recharts';

import { getAnalytics, getScamHistory } from '../../store/slices/scamSlice';
import LoadingSpinner from '../UI/LoadingSpinner';

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { analytics, history, loading } = useSelector((state) => state.scam);

  React.useEffect(() => {
    dispatch(getAnalytics());
    dispatch(getScamHistory());
  }, [dispatch]);

  const typeData = analytics ? [
    { name: 'Text', value: analytics.typeCount.text || 0, color: '#3B82F6' },
    { name: 'URL', value: analytics.typeCount.url || 0, color: '#10B981' },
    { name: 'Phone', value: analytics.typeCount.phone || 0, color: '#8B5CF6' },
    { name: 'Image', value: analytics.typeCount.image || 0, color: '#F59E0B' },
  ] : [];

  const trendData = React.useMemo(() => {
    if (!history.length) return [];

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayScans = history.filter(item =>
        new Date(item.date).toISOString().split('T')[0] === date
      );

      const scams = dayScans.filter(item => item.result === 'scam').length;
      const suspicious = dayScans.filter(item => item.result === 'suspicious').length;
      const safe = dayScans.filter(item => item.result === 'safe').length;

      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        scams,
        suspicious,
        safe,
        total: dayScans.length,
      };
    });
  }, [history]);

  const resultData = analytics ? [
    { name: 'Safe', value: history.filter(h => h.result === 'safe').length, color: '#10B981' },
    { name: 'Suspicious', value: history.filter(h => h.result === 'suspicious').length, color: '#F59E0B' },
    { name: 'Scam', value: history.filter(h => h.result === 'scam').length, color: '#EF4444' },
  ] : [];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Insights into your security scanning activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Safety Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.safetyScore || 0}/100
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              analytics && analytics.safetyScore > 80 ? 'bg-green-100 dark:bg-green-900/20' :
              analytics && analytics.safetyScore > 50 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
              'bg-red-100 dark:bg-red-900/20'
            }`}>
              <Shield className={`h-6 w-6 ${
                analytics && analytics.safetyScore > 80 ? 'text-green-600' :
                analytics && analytics.safetyScore > 50 ? 'text-yellow-600' :
                'text-red-600'
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {history.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Threats Blocked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {history.filter(h => h.result === 'scam').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {trendData.reduce((sum, day) => sum + day.total, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scan Types</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {typeData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Results Distribution</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={resultData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resultData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {resultData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7-Day Activity Trend</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip contentStyle={{ backgroundColor: 'rgb(31 41 55)', border: '1px solid rgb(75 85 99)', borderRadius: '8px', color: 'white' }} />
              <Bar dataKey="safe" stackId="a" fill="#10B981" name="Safe" />
              <Bar dataKey="suspicious" stackId="a" fill="#F59E0B" name="Suspicious" />
              <Bar dataKey="scams" stackId="a" fill="#EF4444" name="Scam" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
