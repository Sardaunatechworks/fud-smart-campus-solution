import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, Eye, Calendar, MapPin, User as UserIcon } from 'lucide-react';
import { Item } from '../types';

const PendingReports = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = () => {
    setIsLoading(true);
    fetch('/api/items?status=pending')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setIsLoading(false);
      });
  };

  const handleAction = async (id: number, status: 'approved' | 'rejected') => {
    await fetch(`/api/items/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setSelectedItem(null);
    fetchPending();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pending Reports</h1>
        <p className="text-slate-500 mt-1">Review and moderate new item reports before they go public.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-fud-green mb-4" size={40} />
          <p className="text-slate-500 font-medium">Loading pending reports...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-20 text-center">
          <div className="w-16 h-16 bg-fud-green/10 text-fud-green rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
          <p className="text-slate-500">There are no pending reports to review at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow flex flex-col sm:flex-row"
            >
              <div className="sm:w-48 h-48 sm:h-auto bg-slate-100 shrink-0">
                <img 
                  src={item.image_url || `https://picsum.photos/seed/${item.id}/400/400`} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    item.type === 'lost' ? 'bg-orange-500 text-white' : 'bg-fud-green text-white'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <MapPin size={14} />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <UserIcon size={14} />
                    <span className="truncate">{item.posted_by}</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button 
                    onClick={() => handleAction(item.id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-2 bg-fud-green text-white py-2.5 rounded-xl font-bold text-sm hover:bg-fud-green-dark transition-all"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(item.id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingReports;
