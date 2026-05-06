'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Cookies from 'js-cookie';
import { ShoppingBag, Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      if (user.role !== 'admin' && user.role !== 'superadmin') {
        toast.error('You do not have admin access');
        return;
      }

      Cookies.set('token', token, { expires: 7 });
      Cookies.set('role', user.role, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful!');
      router.push('/admin');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#131921] via-[#1a2332] to-[#232f3e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <ShoppingBag className="text-[#febd69]" size={32} />
            <span className="font-extrabold text-2xl text-white">
              Affiliate<span className="text-[#febd69]">Hub</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm">Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#FF6B00]/10 p-2.5 rounded-xl">
              <Lock size={20} className="text-[#FF6B00]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-xs text-gray-500">Restricted access — admins only</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@affiliate.com"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition"
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
                  className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition"
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
              className="w-full bg-[#FF6B00] hover:bg-[#e05e00] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign in to Admin Panel'}
            </button>
          </form>

          <div className="mt-5 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
            <strong>Demo:</strong> admin@affiliate.com / password123
          </div>
        </div>
      </div>
    </div>
  );
}
