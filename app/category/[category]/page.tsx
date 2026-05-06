'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { ChevronLeft, Tag } from 'lucide-react';

const CAT_META: Record<string, { emoji: string; color: string }> = {
  'Electronics':   { emoji: '⚡', color: 'text-blue-600 bg-blue-50' },
  'Fashion':       { emoji: '👗', color: 'text-pink-600 bg-pink-50' },
  'Home & Kitchen':{ emoji: '🏠', color: 'text-green-600 bg-green-50' },
  'Beauty':        { emoji: '✨', color: 'text-purple-600 bg-purple-50' },
  'Books':         { emoji: '📚', color: 'text-amber-600 bg-amber-50' },
};

interface Product {
  _id: string; title: string; description: string; images: string[];
  price: number | null; affiliateLink: string; slugId: string; category: string;
}

export default function CategoryPage() {
  const { category } = useParams();
  const decodedCat = decodeURIComponent(category as string);
  const meta = CAT_META[decodedCat] ?? { emoji: '🛍️', color: 'text-gray-600 bg-gray-50' };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/category/${encodeURIComponent(decodedCat)}`)
      .then((res) => setProducts(Array.isArray(res.data.products) ? res.data.products : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [decodedCat]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#FF6B00] hover:underline mb-5 sm:mb-6 font-medium">
          <ChevronLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 ${meta.color}`}>
            {meta.emoji}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">{decodedCat}</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-0.5 flex items-center gap-1.5">
              <Tag size={14} />
              {loading ? 'Loading...' : `${products.length} products`}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.length > 0
              ? products.map((p) => <ProductCard key={p._id} product={p} />)
              : (
                <div className="col-span-full text-center py-16 sm:py-20 text-gray-400">
                  <div className="text-5xl sm:text-6xl mb-4">📭</div>
                  <p className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No products in this category</p>
                  <Link href="/" className="text-[#FF6B00] font-semibold text-sm hover:underline">← Back to Home</Link>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
}
