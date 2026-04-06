import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Item } from '../types';

const BrowseItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Phone', 'ID Card', 'Laptop', 'Bag', 'Books', 'Others'];

  useEffect(() => {
    fetch('/api/items?status=approved')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setIsLoading(false);
      });
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                         item.description.toLowerCase().includes(search.toLowerCase()) ||
                         item.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = filter === 'all' || item.type === filter;
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Browse Items</h1>
          <p className="text-slate-500 mt-1">Search and filter through all reported items on campus.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name, description, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fud-green/20 focus:border-fud-green transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {(['all', 'lost', 'found'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                    filter === t ? 'bg-white text-fud-green shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fud-green/20 focus:border-fud-green transition-all appearance-none font-medium text-slate-700"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-fud-green mb-4" size={40} />
          <p className="text-slate-500 font-medium">Loading items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow hover:border-fud-green transition-all flex flex-col"
            >
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
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-fud-green px-2 py-1 bg-fud-green/10 rounded-lg">{item.category}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 truncate text-lg">{item.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
                <Link 
                  to={`/items/${item.id}`} 
                  className="w-full py-3 bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm hover:bg-fud-green hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  View Details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No items found</h3>
              <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseItems;
