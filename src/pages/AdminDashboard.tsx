import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, FileText, Clock, AlertCircle, TrendingUp, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLostItems: 0,
    totalFoundItems: 0,
    pendingReports: 0
  });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500 mt-1">System statistics and management dashboard.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Students', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Total Lost Items', value: stats.totalLostItems, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Total Found Items', value: stats.totalFoundItems, icon: CheckCircle2, color: 'text-fud-green', bg: 'bg-fud-green/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity / Quick Links */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 card-shadow">
          <h2 className="text-xl font-bold text-slate-900 mb-6">System Management</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/admin/users" className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-fud-green transition-all group">
              <Users className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-slate-900">Manage Users</h3>
              <p className="text-xs text-slate-500 mt-1">View and moderate students</p>
            </Link>
            <Link to="/admin/items" className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-fud-green transition-all group">
              <FileText className="text-fud-green mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-slate-900">Manage Items</h3>
              <p className="text-xs text-slate-500 mt-1">Edit or remove item posts</p>
            </Link>
            <Link to="/admin/pending" className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-fud-green transition-all group">
              <Clock className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold text-slate-900">Pending Reports</h3>
              <p className="text-xs text-slate-500 mt-1">Review and approve posts</p>
            </Link>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 opacity-50 cursor-not-allowed">
              <TrendingUp className="text-orange-500 mb-4" size={32} />
              <h3 className="font-bold text-slate-900">Activity Logs</h3>
              <p className="text-xs text-slate-500 mt-1">Coming soon...</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 card-shadow">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Pending Moderation</h2>
          {stats.pendingReports > 0 ? (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{stats.pendingReports} Items Waiting</p>
                    <p className="text-xs text-slate-500">Reports need your approval</p>
                  </div>
                </div>
                <Link to="/admin/pending" className="p-2 bg-white text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-all">
                  <ArrowUpRight size={20} />
                </Link>
              </div>
              <p className="text-sm text-slate-500 italic">
                Moderation ensures the platform remains safe and organized for all students.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-fud-green/10 text-fud-green rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <p className="font-bold text-slate-900">All caught up!</p>
              <p className="text-sm text-slate-500">No pending reports to moderate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
