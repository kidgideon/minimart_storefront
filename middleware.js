import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl.clone()
  const host = req.headers.get('host') || ''

  // Skip middleware for Next.js internals and static files
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.includes('.') // static files like images
  ) {
    return NextResponse.next()
  }

  // Handle store.minimart.ng first
  if (host === 'store.minimart.ng') {
    url.pathname = '/'
    return NextResponse.rewrite(url)
  }

  // Domains to ignore (main platform + local dev)
  const platformDomains = [
    'minimart.ng',
    'www.minimart.ng',
    'localhost:3000',
    '127.0.0.1:3000'
  ]
  if (platformDomains.includes(host)) {
    return NextResponse.next()
  }

  // Extract storeId
  let storeId = ''
  if (host.endsWith('.minimart.ng')) {
    storeId = host.split('.')[0]
  } else {
    storeId = host.replace(/^www\./, '').split('.')[0]
  }

  if (!storeId) return NextResponse.next()

  // Rewrite rules
  if (url.pathname === '/') {
    url.pathname = `/${storeId}`
    return NextResponse.rewrite(url)
  }

  if (url.pathname.startsWith('/product/')) {
    url.pathname = `/${storeId}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  if (url.pathname === '/cart') {
    url.pathname = `/${storeId}/cart`
    return NextResponse.rewrite(url)
  }

  if (url.pathname.startsWith('/checkout/')) {
    url.pathname = `/${storeId}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  if (url.pathname.startsWith('/order/')) {
    url.pathname = `/${storeId}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
