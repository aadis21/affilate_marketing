'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Package, Tag, Users, TrendingUp, ShoppingBag, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { name: 'Electronics', emoji: '⚡' },
  { name: 'Fashion', emoji: '👗' },
  { name: 'Home & Kitchen', emoji: '🏠' },
  { name: 'Beauty', emoji: '✨' },
  { name: 'Books', emoji: '📚' },
];

interface Stats {
  totalProducts: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    Promise.all([
      api.get('/products/count').catch(() => ({ data: { count: 0 } })),
      api.get('/users').catch(() => ({ data: { users: [] } })),
    ]).then(([prodRes, userRes]) => {
      setStats({
        totalProducts: prodRes.data?.count ?? 0,
        totalUsers: Array.isArray(userRes.data?.users) ? userRes.data.users.length : 0,
      });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', href: '/admin/products' },
    { label: 'Categories', value: 5, icon: Tag, color: 'bg-green-50 text-green-600', border: 'border-green-100', href: '/admin/categories' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', href: '/admin/users' },
    { label: 'Active Deals', value: stats.totalProducts, icon: TrendingUp, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', href: '/admin/products' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <button
          onClick={fetchStats}
          className="bg-white border border-gray-200 text-gray-600 hover:text-gray-900 p-2 rounded-lg transition"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, border, href }) => (
          <Link
            key={label}
            href={href}
            className={`bg-white rounded-xl border ${border} p-5 shadow-sm hover:shadow-md transition group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${color} p-2.5 rounded-xl`}>
                <Icon size={20} />
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-600 transition" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mb-1">
              {loading ? <Loader2 size={22} className="animate-spin text-gray-300" /> : value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 font-medium">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions + Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#FF6B00]" /> Quick Actions
          </h3>
          <div className="space-y-1">
            {[
              { label: 'Add New Product', href: '/admin/products' },
              { label: 'Manage Products', href: '/admin/products' },
              { label: 'View Categories', href: '/admin/categories' },
              { label: 'Manage Users', href: '/admin/users' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
              >
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-[#FF6B00] transition" />
              </Link>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
            >
              <span className="text-sm font-medium text-gray-700">View Live Store ↗</span>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-[#FF6B00] transition" />
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Tag size={18} className="text-[#FF6B00]" /> Categories Overview
          </h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                className="flex items-center justify-between py-2.5 px-3 border-b border-gray-50 last:border-0 rounded-lg hover:bg-gray-50 transition group"
              >
                <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
                  <span>{cat.emoji}</span> {cat.name}
                </span>
                <span className="text-xs bg-[#FF6B00]/10 text-[#FF6B00] px-2.5 py-0.5 rounded-full font-semibold group-hover:bg-[#FF6B00] group-hover:text-white transition">
                  Browse →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}