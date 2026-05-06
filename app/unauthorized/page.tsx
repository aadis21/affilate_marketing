import Link from 'next/link';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="bg-red-50 p-5 sm:p-6 rounded-2xl mb-5 sm:mb-6">
        <ShieldOff size={48} className="text-red-400 sm:w-16 sm:h-16" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-3">Unauthorized</h1>
      <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8 max-w-sm leading-relaxed">
        You do not have permission to access this page. Admin privileges are required.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#e05e00] transition text-sm sm:text-base"
        >
          <Home size={16} /> Go to Home
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition text-sm sm:text-base"
        >
          <ArrowLeft size={16} /> Admin Login
        </Link>
      </div>
    </div>
  );
}
