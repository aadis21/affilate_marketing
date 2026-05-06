'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { ChevronRight, Zap, ShieldCheck, Truck, ArrowRight, Star } from 'lucide-react';

const CATEGORIES = [
  { name: 'Electronics', emoji: '⚡', color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' },
  { name: 'Fashion', emoji: '👗', color: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100' },
  { name: 'Home & Kitchen', emoji: '🏠', color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' },
  { name: 'Beauty', emoji: '✨', color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' },
  { name: 'Books', emoji: '📚', color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' },
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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=20')
      .then((res) => setProducts(Array.isArray(res.data.products) ? res.data.products : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#131921] via-[#1a2332] to-[#232f3e] text-white py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 text-[#febd69] rounded-full px-4 py-2 text-sm font-semibold mb-6 border border-[#FF6B00]/30">
            <Zap size={14} /> Best Affiliate Deals Online
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Shop Smart,<br />
            <span className="text-[#FF6B00]">Save Big</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-lg mb-10 max-w-2xl mx-auto">
            Discover handpicked products across categories. Buy directly with trusted affiliate links.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn-primary">
              Shop All <ArrowRight size={16} />
            </Link>
            <Link href="/category/Electronics" className="btn-secondary">
              Browse Electronics
            </Link>
          </div>

          <div className="flex justify-center gap-6 mt-10 text-xs sm:text-sm text-gray-400 flex-wrap">
            <div className="flex items-center gap-1"><Star size={14} className="text-yellow-400" /> 4.8 Rating</div>
            <div className="flex items-center gap-1"><Truck size={14} className="text-green-400" /> Free Delivery</div>
            <div className="flex items-center gap-1"><ShieldCheck size={14} className="text-blue-400" /> Genuine</div>
          </div>

        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white border-b border-gray-200 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: Truck, label: 'Free Delivery', sub: 'On 1000+ products' },
            { icon: ShieldCheck, label: '100% Genuine', sub: 'Verified items' },
            { icon: Zap, label: 'Best Prices', sub: 'Guaranteed deals' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
              <Icon size={20} className="text-[#FF6B00]" />
              <div>
                <div className="font-semibold">{label}</div>
                <div className="text-sm text-gray-500">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-6 sm:mb-8">Shop by Category</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/category/${encodeURIComponent(cat.name)}`}
                className={`border-2 rounded-xl p-4 text-center font-semibold transition ${cat.color}`}
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="text-sm">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h2 className="section-title">Featured Products</h2>
            <Link href="/search" className="text-[#FF6B00] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition">
              See all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
              : products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FF6B00] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Start Shopping Now</h2>
          <Link href="/search" className="btn-primary bg-white text-[#FF6B00] hover:bg-gray-100">
            Explore <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}