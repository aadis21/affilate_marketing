import Link from 'next/link';
import { ShoppingBag, Mail, Share2, Globe, Heart } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Books'];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#131921] text-white mt-12 sm:mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-[#FF6B00] to-[#e05e00] p-2 rounded-lg">
                <ShoppingBag className="text-white" size={18} />
              </div>
              <div>
                <div className="font-extrabold text-base leading-none">
                  Affiliate<span className="text-[#febd69]">Hub</span>
                </div>
                <div className="text-xs text-gray-400">Best Deals Online</div>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 max-w-xs">
              Your trusted destination for the best affiliate deals and exclusive products across multiple categories.
            </p>
            <div className="flex gap-2">
              {[Share2, Globe, Heart].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-[#febd69] transition p-2 hover:bg-gray-800 rounded-full touch-manipulation">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-[#febd69] text-xs uppercase tracking-widest">Shop Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/category/${encodeURIComponent(cat)}`}
                    className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors font-medium"
                  >
                    → {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-[#febd69] text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'All Products', href: '/search' },
                { label: 'About Us', href: '#' },
                { label: 'Contact', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors font-medium">
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-[#febd69] text-xs uppercase tracking-widest">About</h4>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
              We help you find the best products and exclusive deals from Amazon and other trusted retailers.
            </p>
            <div className="bg-gray-800 rounded-lg p-3 flex items-start gap-2">
              <Mail size={14} className="text-[#febd69] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-500 font-medium">Email Us</div>
                <a href="mailto:hello@affiliatehub.com" className="text-gray-300 text-xs hover:text-[#febd69] transition">
                  hello@affiliatehub.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 mb-5 border border-gray-700">
            <p className="text-gray-400 text-xs leading-relaxed">
              <span className="font-semibold text-gray-300">Affiliate Disclosure:</span> We earn a small commission when you purchase through our affiliate links. This helps us keep the site running at no extra cost to you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-gray-500 text-xs text-center sm:text-left">
              © {year} AffiliateHub. All rights reserved. Built with ❤️ for Smart Shoppers
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs text-gray-500">
              {['Privacy Policy', 'Terms', 'Cookies'].map((l) => (
                <a key={l} href="#" className="hover:text-gray-300 transition">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
