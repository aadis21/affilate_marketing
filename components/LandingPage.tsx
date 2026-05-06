'use client';

import { useState } from 'react';

interface ProductData {
  slugId: string;
  title: string;
  description: string;
  images: string[];
  affiliateLink: string;
  category: string;
  price?: number;
  highlights: string[];
  trustSignals: string[];
}

export default function LandingPage({ product }: { product: ProductData }) {
  const defaultImage = 'https://via.placeholder.com/800x600?text=Product+Image';
  const allImages = product.images && product.images.length > 0 ? product.images : [defaultImage];
  
  const [mainImage, setMainImage] = useState(allImages[0]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar Minimal */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center border-b border-gray-100">
          <p className="text-xs text-center text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Special Offer Available
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
            
            {/* Amazon-Style Image Gallery */}
            <div className="relative group flex flex-col-reverse lg:flex-row gap-4">
              
              {/* Thumbnails (Vertical on desktop, Horizontal on mobile) */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] pb-2 lg:pb-0 shrink-0 hide-scrollbar cursor-pointer">
                {allImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    onMouseEnter={() => setMainImage(img)}
                    onClick={() => setMainImage(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${mainImage === img ? 'border-indigo-600 shadow-md scale-105 ring-2 ring-indigo-100' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'}`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx}`} 
                      className="object-cover w-full h-full"
                      onError={(e) => (e.currentTarget.src = defaultImage)}
                    />
                  </div>
                ))}
              </div>

              {/* Main Image View */}
              <div className="relative flex-1 w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src={mainImage} 
                  alt={product.title} 
                  className="object-contain w-full h-full relative z-10 p-4 transition-opacity duration-300 transform group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = defaultImage)}
                />
                
                {product.trustSignals && product.trustSignals.length > 0 && (
                  <div className="absolute top-4 left-4 z-20 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg transform -rotate-2">
                    {product.trustSignals[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6 w-max">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"></path></svg>
                {product.category}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                {product.title}
              </h1>

              {product.price && (
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
                  <span className="text-lg text-gray-500 mb-1 line-through">₹{(product.price * 1.3).toFixed(2)}</span>
                  <span className="text-sm font-bold text-green-600 mb-1 bg-green-100 px-2 py-0.5 rounded">Save 30%</span>
                </div>
              )}

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a 
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/20 active:scale-95 transition-all duration-200"
                >
                  Buy Now on Amazon
                  <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
              </div>

              {/* Highlights/Benefits */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="border-t border-gray-100 pt-8 mt-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Why you'll love it</h3>
                  <ul className="space-y-3">
                    {product.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-6 h-6 text-emerald-500 shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="bg-gray-900 py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Trusted by thousands of customers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <h3 className="font-bold text-lg mb-2">Secure Checkout</h3>
              <p className="text-gray-400 text-sm">Your data is safe with Amazon's secure checkout process.</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="font-bold text-lg mb-2">Fast Shipping</h3>
              <p className="text-gray-400 text-sm">Enjoy Prime delivery on eligible orders.</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514"></path></svg>
              <h3 className="font-bold text-lg mb-2">Satisfaction</h3>
              <p className="text-gray-400 text-sm">Backed by world-class customer service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Disclaimer */}
      <footer className="bg-white border-t border-gray-200 py-10 pb-28 md:pb-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Disclaimer: As an Amazon Associate, we earn from qualifying purchases. 
            Prices and availability are subject to change. The link provided above is an affiliate link, 
            which means we may receive a small commission at no extra cost to you if you make a purchase.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            &copy; {new Date().getFullYear()} Our Deals Platform. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white p-3 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col justify-between items-center gap-2">
          <div className="flex font-bold justify-between items-center w-full px-2">
            <span className="text-gray-900 truncate flex-1">{product.title}</span>
            {product.price && <span className="text-indigo-600 font-black ml-2">₹{product.price}</span>}
          </div>
          <a 
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-4 py-3 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Buy Now
          </a>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
