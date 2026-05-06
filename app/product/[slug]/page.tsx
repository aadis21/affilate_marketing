import { notFound } from 'next/navigation';
import ProductClient from '@/components/ProductClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://affilate-backend.onrender.com/api';
const FALLBACK_IMAGE = 'https://picsum.photos/seed/fallback/640/480';

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

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.product ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product Not Found', description: 'This product could not be found.' };
  const imageUrl = product.images?.[0] ?? FALLBACK_IMAGE;
  return {
    title: `${product.title} — AffiliateHub`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.substring(0, 160),
      images: [{ url: imageUrl, width: 640, height: 480 }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const images = product.images?.length > 0 ? product.images : [FALLBACK_IMAGE];

  return <ProductClient product={product} images={images} />;
}
