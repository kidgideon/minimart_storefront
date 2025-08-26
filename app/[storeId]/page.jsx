// app/[storeId]/page.jsx
import StorefrontClient from "./StoreFrontClient";
import DEFAULT_LOGO from "../../public/images/no_bg.png";

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
  } catch (err) {
    console.error("Failed to fetch store data:", err);
    return null;
  }
}

// --- SEO Metadata with favicon ---
export async function generateMetadata({ params }) {
  const storeId = params.storeId;
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
  const logo = biz.logo || DEFAULT_LOGO;

  return {
    title: `${biz.businessName} | Minimart`,
    description: biz.description || "Shop amazing products and services",
    metadataBase: new URL("https://minimart.ng"),
    icons: {
      icon: logo,
      shortcut: logo,
      apple: logo,
    },
    openGraph: {
      title: biz.businessName,
      description: biz.description || "",
      url: `https://${storeId}.minimart.ng`,
      images: [logo],
    },
    twitter: {
      card: "summary_large_image",
      title: biz.businessName,
      description: biz.description || "",
      images: [logo],
    },
  };
}

// --- Storefront Page ---
export default async function StorefrontPage({ params }) {
  const storeId = params.storeId;
  const data = await fetchStoreData(storeId);

  if (!data?.biz) return <div>Store not found</div>;

  const { biz } = data;

  // Use biz colors directly, fallback to defaults
  const primary = (biz.primaryColor || DEFAULT_PRIMARY).trim();
  const secondary = (biz.secondaryColor || DEFAULT_SECONDARY).trim();

  return (
    <StorefrontClient
      storeId={storeId}
      biz={biz}
      primary={primary}
      secondary={secondary}
    />
  );
}
