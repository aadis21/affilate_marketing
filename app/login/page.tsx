'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Loader2, ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      Cookies.set('token', token, { expires: 7 });
      Cookies.set('role', user.role, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Welcome back!');

      if (user.role === 'superadmin' || user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f3f3] to-[#e8e8e8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#FF6B00] to-[#e05e00] p-2.5 rounded-xl">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <span className="font-extrabold text-2xl text-gray-900">
              Affiliate<span className="text-[#FF6B00]">Hub</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Sign In</h1>
          <p className="text-sm text-gray-500 mb-6">Welcome back to AffiliateHub</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#FF6B00] font-semibold hover:underline">
              Create one →
            </Link>
          </div>

          <div className="mt-3 text-center text-sm text-gray-500">
            Admin?{' '}
            <Link href="/admin/login" className="text-[#FF6B00] font-semibold hover:underline">
              Admin Panel →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
