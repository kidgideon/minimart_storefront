// app/[storeId]/product/[id]/page.jsx
import ProductPageClient from "./ProductPageClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // Ensure runtime rendering

const DEFAULT_PRIMARY = "#1C2230";
const DEFAULT_SECONDARY = "#43B5F4";

// --- Fetch Product Data from Backend ---
async function fetchProductData(storeId, productId) {
  try {
    const res = await fetch(
      `https://minimart-backend.vercel.app/product/${storeId}/${productId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// --- SEO Metadata ---
export async function generateMetadata({ params }) {
  const { storeId, id } = params; // <-- FIX: removed await

  const data = await fetchProductData(storeId, id);

  if (!data || !data.business || !data.product) {
    return {
      title: "Product Not Found",
      description: "This product could not be found.",
    };
  }

  const { business, product } = data;
  const image = product.images?.[0] || "/default-product.jpg";

  return {
    title: `${product.name} | ${business.businessName}`,
    description: product.description || `Discover ${product.name} on Minimart`,
    openGraph: {
      title: `${product.name} | ${business.businessName}`,
      description: product.description || "",
      url: `https://${storeId}.minimart.ng/product/${
        product._ft === "product" ? product.prodId : product.serviceId
      }`,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${business.businessName}`,
      description: product.description || "",
      images: [image],
    },
  };
}

// --- Product Page ---
export default async function ProductPage({ params }) {
  const { storeId, id } = params; // <-- FIX: removed await

  const data = await fetchProductData(storeId, id);
  if (!data || !data.business || !data.product) return notFound();

  const { business, product } = data;

  const primary = business.primaryColor?.trim() || DEFAULT_PRIMARY;
  const secondary = business.secondaryColor?.trim() || DEFAULT_SECONDARY;

  return (
    <ProductPageClient
      storeId={storeId}
      biz={business}
      product={product}
      primaryColor={primary}
      secondaryColor={secondary}
    />
  );
}
