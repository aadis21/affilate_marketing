'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { SlidersHorizontal, Search, Loader2 } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Books'];
const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number | null;
  affiliateLink: string;
  slugId: string;
  category: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (q) params.search = q;
      if (category !== 'All') params.category = category;
      if (sort) params.sortBy = sort;

      const res = await api.get('/products', { params });
      const data = res.data;
      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalCount(data.pagination?.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [q, category, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [q, category, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Search size={20} className="text-[#FF6B00] shrink-0" />
            <span className="truncate">{q ? `"${q}"` : 'All Products'}</span>
          </h1>
          {!loading && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{totalCount} products found</p>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="bg-white rounded-xl shadow p-4 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-gray-800 mb-4">
              <SlidersHorizontal size={16} className="text-[#FF6B00]" />
              Filters
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">Category</p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium ${
                    category === cat
                      ? 'bg-[#FF6B00] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile filters */}
          <div className="flex md:hidden gap-2 mb-4 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  category === cat
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                    : 'border-gray-300 text-gray-700 bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {loading
              ? Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)
              : products.length > 0
                ? products.map((p) => <ProductCard key={p._id} product={p} />)
                : (
                  <div className="col-span-full text-center py-20 text-gray-400">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-lg font-semibold text-gray-600">No products found</p>
                    <p className="text-sm mt-1">Try different keywords or category</p>
                  </div>
                )
            }
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                      p === page
                        ? 'bg-[#FF6B00] text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[#FF6B00]" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
