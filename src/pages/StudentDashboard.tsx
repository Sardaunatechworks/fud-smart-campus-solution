import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Search, FileText, Clock, ArrowUpRight, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import { Item } from '../types';

import { supabase } from '../lib/supabase';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [stats, setStats] = useState({ lost: 0, found: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (data) {
        setRecentItems(data.slice(0, 4) as any);
        const lost = data.filter((i: any) => i.type === 'lost').length;
        const found = data.filter((i: any) => i.type === 'found').length;
        setStats({ lost, found });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to FUD Smart Campus Solution</h1>
          <p className="text-slate-500 mt-1">Where campus problems are solved.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/report-lost" className="flex items-center gap-2 bg-fud-green text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-fud-green-dark transition-all shadow-lg shadow-fud-green/20">
            <PlusCircle size={18} />
            Report Lost
          </Link>
          <Link to="/report-found" className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold hover:border-fud-green hover:text-fud-green transition-all">
            <Search size={18} />
            Report Found
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Lost Items', value: stats.lost, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Found Items', value: stats.found, icon: CheckCircle2, color: 'text-fud-green', bg: 'bg-fud-green/10' },
          { label: 'Pending Reports', value: '2', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Success Rate', value: '85%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Items</h2>
            <Link to="/browse" className="text-fud-green font-semibold text-sm hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {recentItems.map((item) => (
              <Link key={item.id} to={`/items/${item.id}`} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow hover:border-fud-green transition-all">
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={item.image_url || `https://picsum.photos/seed/${item.id}/400/300`} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    item.type === 'lost' ? 'bg-orange-500 text-white' : 'bg-fud-green text-white'
                  }`}>
                    {item.type}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-2 truncate">{item.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <PlusCircle size={14} />
                      <span>{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Clock size={14} />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {recentItems.length === 0 && (
              <div className="col-span-2 py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400">No items reported yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/report-lost" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 card-shadow hover:border-fud-green transition-all group">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                <PlusCircle size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Report Lost</p>
                <p className="text-xs text-slate-500">I lost something on campus</p>
              </div>
            </Link>
            <Link to="/report-found" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 card-shadow hover:border-fud-green transition-all group">
              <div className="w-12 h-12 bg-fud-green/10 text-fud-green rounded-xl flex items-center justify-center group-hover:bg-fud-green group-hover:text-white transition-all">
                <Search size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Report Found</p>
                <p className="text-xs text-slate-500">I found an item on campus</p>
              </div>
            </Link>
            <Link to="/browse" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 card-shadow hover:border-fud-green transition-all group">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                <FileText size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Browse All</p>
                <p className="text-xs text-slate-500">See all lost and found items</p>
              </div>
            </Link>
          </div>

          <div className="bg-fud-green rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Safety Tip</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Always meet in a public campus area like the library or student center when recovering items.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
