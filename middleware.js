// middleware.js
import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl
  const host = req.headers.get('host') || ''

  // Extract storeId from subdomain or custom domain
  let storeId = ''

  // Handle minimart subdomains (e.g., store123.minimart.ng)
  if (host.endsWith('.minimart.ng')) {
    storeId = host.split('.')[0] // "store123"
  } else {
    // For custom domains like jenniferglow.com, the domain itself is the storeId
    storeId = host.split(':')[0] // remove port if present
  }

  // Prevent rewriting for Next.js system routes (_next, api, etc.)
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

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
