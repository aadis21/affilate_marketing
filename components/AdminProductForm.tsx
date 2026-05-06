'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';

interface ProductData {
  slugId: string;
  title: string;
  description: string;
  images: string;
  affiliateLink: string;
  category: string;
  price: string;
  highlights: string;
  trustSignals: string;
}

interface AdminProductFormProps {
  onSuccess: () => void;
  initialData?: any;
  onCancelEdit?: () => void;
}

export default function AdminProductForm({ onSuccess, initialData, onCancelEdit }: AdminProductFormProps) {
  const [formData, setFormData] = useState<ProductData>({
    slugId: '',
    title: '',
    description: '',
    images: '',
    affiliateLink: '',
    category: '',
    price: '',
    highlights: '',
    trustSignals: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        slugId: initialData.slugId || '',
        title: initialData.title || '',
        description: initialData.description || '',
        images: initialData.images ? initialData.images.join(', ') : '',
        affiliateLink: initialData.affiliateLink || '',
        category: initialData.category || '',
        price: initialData.price ? initialData.price.toString() : '',
        highlights: initialData.highlights ? initialData.highlights.join('\n') : '',
        trustSignals: initialData.trustSignals ? initialData.trustSignals.join(', ') : '',
      });
    } else {
      setFormData({
        slugId: '', title: '', description: '', images: '', affiliateLink: '', category: '', price: '', highlights: '', trustSignals: ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const currentImages = formData.images.split(',').map(s => s.trim()).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
        images: currentImages,
        highlights: formData.highlights.split('\n').filter(Boolean),
        trustSignals: formData.trustSignals.split(',').map(s => s.trim()).filter(Boolean),
      };

      const token = localStorage.getItem('token');
      
      if (isEditing) {
        await api.put(`/products/${initialData.slugId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setFormData({
        slugId: '', title: '', description: '', images: '', affiliateLink: '', category: '', price: '', highlights: '', trustSignals: ''
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4 text-gray-800">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h3 className="text-xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
        {isEditing && (
          <button type="button" onClick={onCancelEdit} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Cancel Edit
          </button>
        )}
      </div>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Slug ID (URL)</label>
          <input required disabled={isEditing} name="slugId" value={formData.slugId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border disabled:bg-gray-100" placeholder="e.g. awesome-gadget" />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input required name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input required name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (optional)</label>
          <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" rows={3}></textarea>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Amazon Affiliate Link</label>
          <input required name="affiliateLink" value={formData.affiliateLink} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
        
        {/* Images with Live Previews */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Images (Comma separated URLs)</label>
          <input name="images" value={formData.images} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="https://...1.jpg, https://...2.jpg" />
          
          {/* Amazon-style live preview container inside form */}
          {currentImages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">Image Previews</h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {currentImages.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-gray-200 shadow-sm shrink-0">
                    <img src={img} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=Error')} />
                    <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 font-mono">{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Highlights (One per line)</label>
          <textarea name="highlights" value={formData.highlights} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" rows={3}></textarea>
        </div>
      </div>
      <div className="pt-4">
        <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition">
          {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Save New Product')}
        </button>
      </div>
    </form>
  );
}
