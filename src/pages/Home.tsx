import React from 'react';
import { motion } from 'motion/react';
import { Search, PlusCircle, ShieldCheck, ArrowRight, MapPin, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-fud-green rounded-xl flex items-center justify-center text-white font-bold text-xl">F</div>
            <span className="font-bold text-xl text-slate-800 hidden sm:block">FUD Smart Campus</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 font-medium hover:text-fud-green px-4 py-2">Login</Link>
            <Link to="/register" className="bg-fud-green text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-fud-green-dark transition-all shadow-lg shadow-fud-green/20">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-fud-green/10 text-fud-green rounded-full font-medium text-sm mb-8"
          >
            <ShieldCheck size={16} />
            <span>Official Lost & Found Platform</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            FUD Smart Campus <br />
            <span className="text-fud-green">Lost & Found System</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A modern university web platform for Federal University Dutse students and staff to report, find, and recover lost items within the campus.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/report-lost" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-fud-green text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-fud-green-dark transition-all shadow-xl shadow-fud-green/20">
              <PlusCircle size={24} />
              Report Lost Item
            </Link>
            <Link to="/report-found" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-fud-green hover:text-fud-green transition-all">
              <Search size={24} />
              Report Found Item
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600">Simple steps to recover your items</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Report Item', desc: 'Submit details of the item you lost or found on campus.', icon: PlusCircle, color: 'bg-blue-500' },
              { title: 'Browse Items', desc: 'Search through our database of reported items with filters.', icon: Search, color: 'bg-fud-green' },
              { title: 'Recover Item', desc: 'Connect with the finder and recover your lost property.', icon: ShieldCheck, color: 'bg-orange-500' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl card-shadow border border-slate-100"
              >
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-fud-green rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <span className="font-bold text-slate-800">FUD Smart Campus</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Federal University Dutse. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-fud-green transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-fud-green transition-colors">Facebook</a>
            <a href="#" className="text-slate-400 hover:text-fud-green transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
