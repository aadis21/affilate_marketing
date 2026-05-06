'use client';

import Link from 'next/link';
import { Tag, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { name: 'Electronics', emoji: '⚡', desc: 'Phones, laptops, gadgets & more', count: 25 },
  { name: 'Fashion', emoji: '👗', desc: 'Clothing, shoes, accessories', count: 25 },
  { name: 'Home & Kitchen', emoji: '🏠', desc: 'Appliances, furniture, decor', count: 25 },
  { name: 'Beauty', emoji: '✨', desc: 'Skincare, makeup, wellness', count: 25 },
  { name: 'Books', emoji: '📚', desc: 'Bestsellers, fiction, self-help', count: 25 },
];

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Tag size={22} className="text-[#FF6B00]" /> Categories
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">5 categories · 125 total products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl">{cat.emoji}</div>
              <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold px-2.5 py-1 rounded-full">
                {cat.count} products
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{cat.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{cat.desc}</p>
            <Link
              href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6B00] hover:underline"
            >
              View Products <ChevronRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
