// app/[storeId]/page.jsx
import StorefrontClient from "./StoreFrontClient";

export const dynamic = "force-dynamic"; // Ensures server-rendered at request time

const DEFAULT_PRIMARY = "#1C2230";
const DEFAULT_SECONDARY = "#43B5F4";

// --- Fetch Store Data from Backend ---
async function fetchStoreData(storeId) {
  try {
    const res = await fetch(
      `https://minimart-backend.vercel.app/store?storeId=${storeId}`,
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
  const storeId = params.storeId;
  const data = await fetchStoreData(storeId);

  if (!data?.biz) {
    return {
      title: "Store Not Found",
      description: "This store could not be found.",
      metadataBase: new URL("https://minimart.ng"),
    };
  }

  const { biz } = data;

  return {
    title: `${biz.businessName} | Minimart`,
    description: biz.description || "Shop amazing products and services",
    metadataBase: new URL("https://minimart.ng"), // Ensures OG/Twitter URLs resolve correctly
    openGraph: {
      title: biz.businessName,
      description: biz.description || "",
      url: `https://${storeId}.minimart.ng`,
      images: [biz.customTheme?.logo || "/default-store.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: biz.businessName,
      description: biz.description || "",
      images: [biz.customTheme?.logo || "/default-store.jpg"],
    },
  };
}

// --- Storefront Page ---
export default async function StorefrontPage({ params }) {
  const storeId = params.storeId;
  const data = await fetchStoreData(storeId);
  if (!data?.biz) return <div>Store not found</div>;

  const { biz } = data;
  const primary = biz.customTheme?.primaryColor?.trim() || DEFAULT_PRIMARY;
  const secondary = biz.customTheme?.secondaryColor?.trim() || DEFAULT_SECONDARY;

  return (
    <StorefrontClient
      storeId={storeId}
      biz={biz}
      primary={primary}
      secondary={secondary}
    />
  );
}
