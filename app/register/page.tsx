'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPw) return toast.error('Please fill all fields');
    if (password !== confirmPw) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { email, password });
      const { token, user } = res.data;

      Cookies.set('token', token, { expires: 7 });
      Cookies.set('role', user.role, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Account created!');
      router.push('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#FF6B00]/10 p-2.5 rounded-xl">
            <UserPlus size={20} className="text-[#FF6B00]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-500">Join AffiliateHub today</p>
          </div>
        </div>

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
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
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
                placeholder="Min 6 characters"
                className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat password"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#FF6B00] font-semibold hover:underline">
            Sign in →
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
