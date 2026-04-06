import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Calendar, Tag, User as UserIcon, Mail, MessageSquare, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Item } from '../types';

import { supabase } from '../lib/supabase';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (data) {
        setItem({
          ...(data as any),
          posted_by: (data as any).profiles?.full_name || 'System User',
          contact_email: (data as any).profiles?.email || 'support@fud.edu.ng'
        });
      }
      setIsLoading(false);
    };

    fetchItemDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-fud-green mb-4" size={40} />
        <p className="text-slate-500 font-medium">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Item not found</h2>
        <button onClick={() => navigate('/browse')} className="mt-4 text-fud-green font-bold">Back to Browse</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-fud-green font-bold transition-all"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow h-[400px] lg:h-[500px]"
        >
          <img 
            src={item.image_url || `https://picsum.photos/seed/${item.id}/800/600`} 
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
              item.type === 'lost' ? 'bg-orange-500 text-white' : 'bg-fud-green text-white'
            }`}>
              {item.type}
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{item.name}</h1>
            <p className="text-slate-600 leading-relaxed text-lg">{item.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 card-shadow">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Category</p>
                <p className="font-bold text-slate-800">{item.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 card-shadow">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Location</p>
                <p className="font-bold text-slate-800">{item.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 card-shadow">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date</p>
                <p className="font-bold text-slate-800">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 card-shadow">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Posted By</p>
                <p className="font-bold text-slate-800">{item.posted_by}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-fud-green" size={20} />
              Contact Information
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`mailto:${item.contact_email}`}
                className="flex-1 flex items-center justify-center gap-2 bg-fud-green text-white px-6 py-4 rounded-2xl font-bold hover:bg-fud-green-dark transition-all shadow-lg shadow-fud-green/20"
              >
                <Mail size={20} />
                Contact {item.type === 'lost' ? 'Owner' : 'Finder'}
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-800 border-2 border-slate-200 px-6 py-4 rounded-2xl font-bold hover:border-fud-green hover:text-fud-green transition-all">
                <MessageSquare size={20} />
                Send Message
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center italic">
              Remember to verify ownership before handing over any item.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemDetails;
