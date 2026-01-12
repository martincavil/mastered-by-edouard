import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';

function getLocaleFromHeader(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  const languages = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().toLowerCase());

  for (const lang of languages) {
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('en')) return 'en';
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/robots')
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Check for saved locale in cookie
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;
  let locale = defaultLocale;

  if (savedLocale && locales.includes(savedLocale as any)) {
    locale = savedLocale as any;
  } else {
    // Auto-detect from browser
    locale = getLocaleFromHeader(request);
  }

  // Redirect to home with locale
  if (pathname === '/') {
    const response = NextResponse.redirect(
      new URL(`/${locale}`, request.url)
    );
    response.cookies.set('NEXT_LOCALE', locale, { maxAge: 31536000 });
    return response;
  }

  // Redirect other paths with locale
  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );
  response.cookies.set('NEXT_LOCALE', locale, { maxAge: 31536000 });
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
