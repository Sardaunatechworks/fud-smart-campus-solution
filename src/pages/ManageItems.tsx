import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Trash2, CheckCircle2, XCircle, Loader2, ExternalLink, Filter } from 'lucide-react';
import { Item } from '../types';
import { Link, useSearchParams } from 'react-router-dom';

const ManageItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') as 'lost' | 'found' | null;
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>(typeParam || 'all');

  useEffect(() => {
    setTypeFilter(typeParam || 'all');
  }, [typeParam]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setIsLoading(true);
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setIsLoading(false);
      });
  };

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/items/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item report?')) {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  const filteredItems = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || 
                         i.posted_by?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || i.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Items</h1>
          <p className="text-slate-500 mt-1">Review and moderate all item reports.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 card-shadow overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by item name or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fud-green/20 focus:border-fud-green transition-all"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl self-start">
            {(['all', 'lost', 'found'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  typeFilter === t ? 'bg-white text-fud-green shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Posted By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-fud-green mx-auto mb-2" size={32} />
                    <p className="text-slate-500">Loading items...</p>
                  </td>
                </tr>
              ) : filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img 
                          src={item.image_url || `https://picsum.photos/seed/${item.id}/100/100`} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${item.type === 'lost' ? 'text-orange-500' : 'text-fud-green'}`}>{item.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.category}</td>
                  <td className="px-6 py-4 text-slate-600">{item.posted_by}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'approved' ? 'bg-fud-green/10 text-fud-green' : 
                      item.status === 'pending' ? 'bg-blue-50 text-blue-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/items/${item.id}`}
                        className="p-2 text-slate-400 hover:text-fud-green hover:bg-fud-green/10 rounded-lg transition-all"
                        title="View Details"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      {item.status !== 'approved' && (
                        <button 
                          onClick={() => handleStatusChange(item.id, 'approved')}
                          className="p-2 text-fud-green hover:bg-fud-green/10 rounded-lg transition-all"
                          title="Approve"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      {item.status !== 'rejected' && (
                        <button 
                          onClick={() => handleStatusChange(item.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No items found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageItems;
