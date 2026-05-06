'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Star, Copy, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number | null;
  affiliateLink: string;
  slugId: string;
  category: string;
}

const FALLBACK_IMAGE = 'https://picsum.photos/seed/fallback/400/300';

export default function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.images?.length > 0 ? product.images[0] : FALLBACK_IMAGE;

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(`${window.location.origin}/product/${product.slugId}`);
    toast.success('Link copied!');
  };

  const shareProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({ title: product.title, url: `${window.location.origin}/product/${product.slugId}` });
    } else {
      copyLink(e);
    }
  };

  return (
    <Link href={`/product/${product.slugId}`} className="block h-full">
      <div className="group h-full bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />
          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-[#FF6B00] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow">
            {product.category}
          </div>
          {/* Hover actions */}
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={copyLink}
              className="bg-white/95 p-1.5 sm:p-2 rounded-full shadow transition hover:scale-110"
              title="Copy link"
            >
              <Copy size={13} className="text-gray-700" />
            </button>
            <button
              onClick={shareProduct}
              className="bg-white/95 p-1.5 sm:p-2 rounded-full shadow transition hover:scale-110"
              title="Share"
            >
              <Share2 size={13} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {/* Stars */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className={s <= 4 ? 'text-[#febd69] fill-[#febd69]' : 'text-gray-300 fill-gray-300'}
              />
            ))}
            <span className="text-[10px] sm:text-xs text-gray-500 ml-0.5">(4.0)</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-2 leading-snug group-hover:text-[#FF6B00] transition-colors flex-1">
            {product.title}
          </h3>

          {/* Price */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-100">
              {product.price ? (
                <>
                  <span className="text-sm sm:text-base lg:text-lg font-extrabold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-green-600 font-semibold">Free Delivery</span>
                </>
              ) : (
                <span className="text-xs sm:text-sm text-gray-400">Price on Amazon</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={(e) => { e.preventDefault(); window.location.href = `/product/${product.slugId}`; }}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 sm:py-2 rounded-lg text-center text-[10px] sm:text-xs font-semibold transition border border-gray-200 min-h-[32px]"
              >
                Details
              </button>
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white py-1.5 sm:py-2 rounded-lg text-center text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1 shadow min-h-[32px]"
              >
                <ExternalLink size={11} /> Buy
              </a>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
