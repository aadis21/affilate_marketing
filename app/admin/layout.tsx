'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Package, Tag, Users, LogOut, ShoppingBag, Menu, X, ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
  { href: '/admin/categories', label: 'Categories', icon: Tag, exact: false },
  { href: '/admin/users', label: 'Users', icon: Users, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('Admin');
  const [userRole, setUserRole] = useState('admin');

  // Start open on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserEmail(parsed.email ?? 'Admin');
        setUserRole(parsed.role ?? 'admin');
      }
    } catch { /* ignore */ }
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    localStorage.removeItem('user');
    toast.success('Logged out');
    router.push('/admin/login');
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    if (href === '/admin') return pathname === href;
    return pathname.startsWith(href);
  };

  const initials = userEmail.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-30
          admin-sidebar flex flex-col
          transition-all duration-300 shrink-0
          ${sidebarOpen ? 'w-60 translate-x-0' : 'w-60 -translate-x-full lg:translate-x-0 lg:w-16'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10 shrink-0">
          <ShoppingBag size={22} className="text-[#febd69] shrink-0" />
          <span className={`font-extrabold text-white text-base transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
            Affiliate<span className="text-[#febd69]">Hub</span>
          </span>
        </div>

        {/* Role badge */}
        <div className={`px-4 pt-3 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            userRole === 'superadmin' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
          }`}>
            {userRole}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                isActive(href, exact)
                  ? 'bg-[#FF6B00] text-white shadow-md'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className={`transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 space-y-1 border-t border-white/10 pt-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition touch-manipulation"
          >
            <ExternalLink size={18} className="shrink-0" />
            <span className={`transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              View Store
            </span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition touch-manipulation"
          >
            <LogOut size={18} className="shrink-0" />
            <span className={`transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 flex items-center gap-3 shadow-sm shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-900 transition p-1.5 rounded-lg hover:bg-gray-100 touch-manipulation"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="font-bold text-gray-800 text-sm sm:text-base">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate max-w-[140px] md:max-w-[200px]">
              {userEmail}
            </span>
            <div className="w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
