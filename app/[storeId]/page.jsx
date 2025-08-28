// app/[storeId]/page.jsx
import StorefrontClient from "./StoreFrontClient";
import DEFAULT_LOGO from "../../public/images/no_bg.png";

export const dynamic = "force-dynamic"; // Server-rendered on request

const DEFAULT_PRIMARY = "#1C2230";
const DEFAULT_SECONDARY = "#43B5F4";

// --- Fetch Store Data ---
async function fetchStoreData(storeId) {
  if (!storeId) return null; // Guard against empty params
  try {
    const res = await fetch(
      `https://minimart-backend.vercel.app/store?storeId=${storeId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch store data:", err);
    return null;
  }
}

// --- SEO Metadata ---
export async function generateMetadata({ params }) {
  const { storeId } = await params; // ✅ FIXED

  const data = await fetchStoreData(storeId);
  if (!data?.biz) {
    return {
      title: "Store Not Found",
      description: "This store could not be found.",
      metadataBase: new URL("https://minimart.ng"),
      icons: {
        icon: DEFAULT_LOGO,
        shortcut: DEFAULT_LOGO,
        apple: DEFAULT_LOGO,
      },
    };
  }

  const { biz } = data;
  const logo = typeof biz.logo === "string" ? biz.logo : DEFAULT_LOGO;

  return {
    title: `${biz.businessName || "Store"} | Minimart`,
    description: biz.description || "Shop amazing products and services",
    metadataBase: new URL("https://minimart.ng"),
    icons: {
      icon: logo,
      shortcut: logo,
      apple: logo,
    },
    openGraph: {
      title: biz.businessName || "Store",
      description: biz.description || "",
      url: `https://${storeId}.minimart.ng`,
      images: [logo],
    },
    twitter: {
      card: "summary_large_image",
      title: biz.businessName || "Store",
      description: biz.description || "",
      images: [logo],
    },
  };
}

// --- Storefront Page ---
export default async function StorefrontPage({ params }) {
  const { storeId } = await params; // ✅ FIXED
  const data = await fetchStoreData(storeId);

  if (!data?.biz) return <div>Store not found</div>;

  const { biz } = data;

  // Defensive color fallback (only use strings)
  const primary = typeof biz.primaryColor === "string" && biz.primaryColor.trim() !== ""
    ? biz.primaryColor.trim()
    : DEFAULT_PRIMARY;

  const secondary = typeof biz.secondaryColor === "string" && biz.secondaryColor.trim() !== ""
    ? biz.secondaryColor.trim()
    : DEFAULT_SECONDARY;

  return (
    <StorefrontClient
      storeId={storeId}
      biz={biz}
      primary={primary}
      secondary={secondary}
    />
  );
}
