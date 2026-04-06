import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, MapPin, Calendar, Tag, FileText, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

interface ReportFormProps {
  type: 'lost' | 'found';
}

import { supabase } from '../lib/supabase';

const ReportItem: React.FC<ReportFormProps> = ({ type }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Phone',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: ''
  });

  const categories = ['Phone', 'ID Card', 'Laptop', 'Bag', 'Books', 'Others'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('items')
        .insert([{
          name: formData.name,
          category: formData.category,
          description: formData.description,
          location: formData.location,
          date: formData.date,
          type,
          image_url: formData.imageUrl,
          user_id: user?.id,
          status: 'pending'
        }]);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-fud-green text-white rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle size={40} />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Report Submitted!</h2>
        <p className="text-slate-500">Your report has been submitted and is pending admin approval.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Report {type === 'lost' ? 'Lost' : 'Found'} Item</h1>
        <p className="text-slate-500 mt-1">Provide as much detail as possible to help identify the item.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 card-shadow space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. iPhone 13, Student ID"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fud-green/20 focus:border-fud-green transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fud-green/20 focus:border-fud-green transition-all appearance-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the item (color, brand, unique marks...)"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fud-green/20 focus:border-fud-green transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location {type === 'lost' ? 'Lost' : 'Found'}</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. LT 1, Faculty of Science"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fud-green/20 focus:border-fud-green transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date {type === 'lost' ? 'Lost' : 'Found'}</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fud-green/20 focus:border-fud-green transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Image</label>
            <div className="relative group">
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 cursor-pointer hover:border-fud-green hover:bg-fud-green/5 transition-all"
              >
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <>
                    <Upload className="text-slate-400 mb-2" size={32} />
                    <span className="text-slate-500 font-medium">Click to upload or drag and drop</span>
                    <span className="text-slate-400 text-xs mt-1">PNG, JPG up to 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <button 
          disabled={isLoading}
          className="w-full py-4 bg-fud-green text-white rounded-2xl font-bold text-lg hover:bg-fud-green-dark transition-all shadow-lg shadow-fud-green/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : `Submit ${type === 'lost' ? 'Lost' : 'Found'} Item Report`}
        </button>
      </form>
    </div>
  );
};

export default ReportItem;
