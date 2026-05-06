'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Books'];

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      
      {/* 🔥 MAIN NAV */}
      <div className="bg-[#131921] text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-gradient-to-br from-[#FF6B00] to-[#e05e00] p-2 rounded-lg">
              <ShoppingBag size={20} />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-extrabold text-base">
                Affiliate<span className="text-[#febd69]">Hub</span>
              </span>
              <span className="text-[10px] text-gray-400 hidden lg:block">
                Best Deals Online
              </span>
            </div>
          </Link>

          {/* Category dropdown */}
          <div className="relative hidden lg:block" ref={catRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition"
            >
              <Menu size={15} /> Categories
              <ChevronDown size={13} className={`transition ${catOpen ? 'rotate-180' : ''}`} />
            </button>

            {catOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white text-black rounded-xl shadow-xl w-52 overflow-hidden z-50">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${encodeURIComponent(cat)}`}
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 🔥 SEARCH BAR FIX */}
          <form onSubmit={handleSearch} className="flex-1 flex min-w-0">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 min-w-0 px-3 py-2 text-sm text-gray-900 rounded-l-lg outline-none"
            />
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f0a832] px-3 py-2 rounded-r-lg flex items-center justify-center"
            >
              <Search size={18} className="text-black" />
            </button>
          </form>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* 🔥 DESKTOP NAV */}
        <div className="hidden lg:flex bg-[#232f3e] border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 py-2 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/category/${encodeURIComponent(cat)}`}
                className="text-xs uppercase whitespace-nowrap hover:text-[#febd69]"
              >
                {cat}
              </Link>
            ))}
            <Link href="/search" className="ml-auto text-xs hover:text-[#febd69]">
              All Products →
            </Link>
          </div>
        </div>
      </div>

      {/* 🔥 MOBILE DRAWER FIX */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#1a2332] text-white border-t border-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/category/${encodeURIComponent(cat)}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm py-2 border-b border-gray-700"
              >
                {cat}
              </Link>
            ))}
            <Link href="/search" className="text-sm py-2">
              All Products →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}