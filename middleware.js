// middleware.js
import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl.clone()
  const host = req.headers.get('host') || ''

  // Skip middleware for Next.js system and API routes
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.includes('.') // static files like images
  ) {
    return NextResponse.next()
  }

  // Ignore only the main platform domain (not stores)
  const platformDomains = ['minimart.ng', 'www.minimart.ng']
  if (platformDomains.includes(host)) {
    return NextResponse.next()
  }

  // Extract storeId from subdomain or custom domain
  let storeId = ''
  if (host.endsWith('.minimart.ng')) {
    storeId = host.split('.')[0] // e.g., campusicon
  } else {
    // For custom domains: take the part before the first dot
    storeId = host.replace(/^www\./, '').split('.')[0] // e.g., jenniferglow.com → jenniferglow
  }

  if (!storeId) return NextResponse.next() // No rewrite if storeId is missing

  // Rewrite root `/` → `/{storeId}`
  if (url.pathname === '/') {
    url.pathname = `/${storeId}`
    return NextResponse.rewrite(url)
  }

  // Rewrite `/product/:id` → `/{storeId}/product/:id`
  if (url.pathname.startsWith('/product/')) {
    url.pathname = `/${storeId}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
