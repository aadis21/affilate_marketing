'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Star, Copy, Share2, ShieldCheck, Truck, RotateCcw, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number | null;
  affiliateLink: string;
  slugId: string;
  category: string;
  highlights?: string[];
  trustSignals?: string[];
}

interface ProductClientProps {
  product: Product;
  images: string[];
}

export default function ProductClient({ product, images }: ProductClientProps) {
  const [activeImg, setActiveImg] = useState(0);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#FF6B00] hover:underline mb-5 sm:mb-6 font-medium"
        >
          <ChevronLeft size={15} /> Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* ── Image Gallery ── */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 md:border-r border-gray-100">
              <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-square rounded-xl overflow-hidden bg-gray-200 mb-3 sm:mb-4">
                <Image
                  src={images[activeImg]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === activeImg ? 'border-[#FF6B00] scale-105' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product Info ── */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col">

              {/* Category */}
              <span className="inline-block bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug mb-3">
                {product.title}
              </h1>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={15} className={s <= 4 ? 'text-[#febd69] fill-[#febd69]' : 'text-gray-300 fill-gray-300'} />
                ))}
                <span className="text-xs sm:text-sm text-gray-500 ml-1 font-medium">4.0 / 5.0</span>
              </div>

              {/* Price */}
              {product.price && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="ml-2 text-xs sm:text-sm text-green-600 font-semibold">Free Delivery</span>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5">{product.description}</p>

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-bold text-gray-800 mb-2 text-xs sm:text-sm uppercase tracking-wide">Highlights</h3>
                  <ul className="space-y-1.5">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shrink-0 mt-1.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Trust Signals */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: Truck, label: 'Free Delivery', col: 'text-[#FF6B00]' },
                  { icon: RotateCcw, label: '10 Days Return', col: 'text-blue-500' },
                  { icon: ShieldCheck, label: 'Genuine', col: 'text-green-500' },
                ].map(({ icon: Icon, label, col }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 sm:px-3 py-2 rounded-lg border border-gray-100">
                    <Icon size={13} className={col} /> {label}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold py-3 sm:py-3.5 rounded-xl text-center transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-md"
                >
                  <ExternalLink size={15} /> Buy on Amazon
                </a>
                <button
                  onClick={copyLink}
                  className="sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-3 sm:py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 text-sm"
                  title="Copy link"
                >
                  <Copy size={16} /> Copy
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.title, url: window.location.href });
                    } else {
                      copyLink();
                    }
                  }}
                  className="sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-3 sm:py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 text-sm"
                  title="Share"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
