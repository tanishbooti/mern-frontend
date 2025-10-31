import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Shield, Scan, History, AlertTriangle, TrendingUp, Users, Phone, Globe } from 'lucide-react';
import { getAnalytics, getScamUpdates } from '../../store/slices/scamSlice';
import LoadingSpinner from '../UI/LoadingSpinner';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { analytics, updates, loading } = useSelector((state) => state.scam);
  const { user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(getAnalytics());
    dispatch(getScamUpdates());
  }, [dispatch]);

  const quickActions = [
    { title: 'Text Scan', description: 'Check text messages for scams', icon: Scan, link: '/scan?type=text', color: 'from-blue-500 to-blue-600' },
    { title: 'URL Check', description: 'Verify website safety', icon: Globe, link: '/scan?type=url', color: 'from-green-500 to-green-600' },
    { title: 'Phone Lookup', description: 'Check phone number reputation', icon: Phone, link: '/scan?type=phone', color: 'from-purple-500 to-purple-600' },
    { title: 'View History', description: 'See your scan history', icon: History, link: '/history', color: 'from-orange-500 to-orange-600' },
  ];

  const statsCards = [
    { title: 'Safety Score', value: analytics?.safetyScore || 0, suffix: '/100', icon: Shield, color: analytics?.safetyScore > 80 ? 'text-green-600' : analytics?.safetyScore > 50 ? 'text-yellow-600' : 'text-red-600', bgColor: analytics?.safetyScore > 80 ? 'bg-green-100 dark:bg-green-900/20' : analytics?.safetyScore > 50 ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-red-100 dark:bg-red-900/20' },
    { title: 'Total Scans', value: analytics?.totalScams || 0, suffix: '', icon: Scan, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Threats Blocked', value: analytics ? Object.values(analytics.typeCount || {}).reduce((a, b) => a + b, 0) : 0, suffix: '', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' },
    { title: 'Active Watchlist', value: 12, suffix: '', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-800 dark:text-gray-400 text-lg">
          Stay protected with real-time scam detection and monitoring.
        </p>
      </motion.div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
        {statsCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.15 }}
            className="rounded-2xl shadow-lg border border-gray-400 dark:border-gray-700 p-6 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-400 font-semibold">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}{stat.suffix}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.06 }}
              className="overflow-hidden rounded-2xl shadow-lg border border-gray-400 dark:border-gray-700"
            >
              <Link to={action.link} className="block bg-white dark:bg-gray-900 p-6">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${action.color} mb-4 shadow-md`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-800 dark:text-gray-400">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg border border-gray-400 dark:border-gray-700 p-6 bg-white dark:bg-gray-900"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Alerts</h2>
            <Link to="/updates" className="text-purple-600 hover:text-purple-700 font-medium text-sm">View all</Link>
          </div>
          <div className="space-y-4">
            {updates.slice(0, 3).map((update) => (
              <div key={update._id} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                <div className={`p-2 rounded-lg ${
                  update.type === 'alert'
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : update.type === 'warning'
                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                    : 'bg-blue-100 dark:bg-blue-900/20'
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    update.type === 'alert'
                      ? 'text-red-600'
                      : update.type === 'warning'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{update.title}</h3>
                  <p className="text-xs text-gray-800 dark:text-gray-400 mt-1">{update.description.substring(0, 100)}...</p>
                  <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">{new Date(update.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl shadow-lg border border-gray-400 dark:border-gray-700 p-6 bg-white dark:bg-gray-900"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Protection Tips</h2>
          <div className="space-y-4">
            {[{ icon: Shield, title: 'Verify Before Clicking', desc: 'Always check URLs and sender info before clicking links.' },
              { icon: TrendingUp, title: 'Stay Updated', desc: 'Keep your security knowledge current with scam alerts.' },
              { icon: Users, title: 'Report Suspicious Activity', desc: 'Help protect the community by reporting scams.' }].map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800">
                  <tip.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{tip.title}</h3>
                  <p className="text-xs text-gray-800 dark:text-gray-400 mt-1">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
