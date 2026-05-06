'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Search, Loader2, Package } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number | null;
  slugId: string;
  affiliateLink: string;
  description: string;
  images: string[];
}

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Books'];
const EMPTY_FORM = { title: '', description: '', category: 'Electronics', price: '', affiliateLink: '', images: '' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?limit=200');
      setProducts(Array.isArray(res.data.products) ? res.data.products : []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      title: p.title,
      description: p.description,
      category: p.category,
      price: p.price?.toString() || '',
      affiliateLink: p.affiliateLink,
      images: p.images.join(', '),
    });
    setModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.affiliateLink) return toast.error('Title and affiliate link are required');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: form.price ? parseFloat(form.price) : null,
        affiliateLink: form.affiliateLink,
        images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (editProduct) {
        await api.put(`/products/${editProduct.slugId}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setModal(false);
      fetchProducts();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this product?')) return;
    setDeleteId(slug);
    try {
      await api.delete(`/products/${slug}`);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p.slugId !== slug));
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = catFilter === 'All' || p.category === catFilter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Package size={22} className="text-[#FF6B00]" /> Products
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} products</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-[#FF6B00] outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                catFilter === cat ? 'bg-[#FF6B00] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Price</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-gray-800 line-clamp-1">{p.title}</div>
                      <div className="text-xs text-gray-400 font-mono">{p.slugId}</div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-700 hidden sm:table-cell">
                      {p.price ? `₹${p.price.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.slugId)}
                          disabled={deleteId === p.slugId}
                          className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-lg transition disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteId === p.slugId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900 text-lg">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {[
                { label: 'Title *', key: 'title', type: 'text', placeholder: 'Product title' },
                { label: 'Affiliate Link *', key: 'affiliateLink', type: 'url', placeholder: 'https://amzn.to/...' },
                { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '999' },
                { label: 'Image URLs (comma-separated)', key: 'images', type: 'text', placeholder: 'https://..., https://...' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
