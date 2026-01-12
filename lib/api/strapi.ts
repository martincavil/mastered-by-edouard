import { Locale } from '@/lib/i18n';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiEntity {
  id: number;
  attributes: Record<string, any>;
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
    ...options.headers,
  };

  const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    ...options,
    headers,
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getTestimonials(locale: Locale, featured?: boolean) {
  const params = new URLSearchParams({
    locale,
    populate: '*',
    sort: 'order:asc',
    ...(featured !== undefined && { 'filters[featured][$eq]': String(featured) }),
  });

  const response = await fetchAPI<StrapiResponse<StrapiEntity[]>>(
    `/testimonials?${params.toString()}`
  );

  return response.data.map((item) => ({
    id: item.id,
    ...item.attributes,
  }));
}

export async function getFAQs(locale: Locale, category?: string) {
  const params = new URLSearchParams({
    locale,
    populate: '*',
    sort: 'order:asc',
    ...(category && { 'filters[category][$eq]': category }),
  });

  const response = await fetchAPI<StrapiResponse<StrapiEntity[]>>(
    `/faqs?${params.toString()}`
  );

  return response.data.map((item) => ({
    id: item.id,
    ...item.attributes,
  }));
}

export async function getPricingBlocks(locale: Locale) {
  const params = new URLSearchParams({
    locale,
    populate: '*',
    sort: 'order:asc',
  });

  const response = await fetchAPI<StrapiResponse<StrapiEntity[]>>(
    `/pricing-blocks?${params.toString()}`
  );

  return response.data.map((item) => ({
    id: item.id,
    ...item.attributes,
  }));
}

// Type definitions for content types
export interface Testimonial {
  id: number;
  clientName: string;
  role?: string;
  content: string;
  rating: number;
  projectName?: string;
  featured: boolean;
  order: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'pricing' | 'process';
  order: number;
}

export interface PricingBlock {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  features: string[];
  highlighted: boolean;
  order: number;
}
