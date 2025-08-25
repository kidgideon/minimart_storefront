// app/[storeId]/page.jsx
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import StorefrontClient from "./StorefrontClient"; // NEW client wrapper

const DEFAULT_PRIMARY = "#1C2230";
const DEFAULT_SECONDARY = "#43B5F4";

// --- Helper: Serialize Firestore Data ---
function serializeFirestoreData(data) {
  if (!data) return null;

  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // Convert Firestore Timestamps to ISO strings
      if (value && value.seconds !== undefined && value.nanoseconds !== undefined) {
        return new Date(value.seconds * 1000 + value.nanoseconds / 1e6).toISOString();
      }
      return value;
    })
  );
}

// --- SEO for Storefront ---
export async function generateMetadata({ params }) {
  const { storeId } = params;
  const bizRef = doc(db, "businesses", storeId);
  const bizSnap = await getDoc(bizRef);

  if (!bizSnap.exists()) {
    return { title: "Store Not Found" };
  }

  const biz = serializeFirestoreData(bizSnap.data());

  return {
    title: `${biz.businessName} | Minimart`,
    description: biz.description || "Shop amazing products and services",
    openGraph: {
      title: biz.businessName,
      description: biz.description || "",
      url: `https://${storeId}.minimart.ng`,
      images: [biz.customTheme.logo || "/default-store.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: biz.businessName,
      description: biz.description || "",
      images: [biz.customTheme.logo || "/default-store.jpg"],
    },
  };
}

// --- Storefront Page ---
export default async function StorefrontPage({ params }) {
  const { storeId } = params;
  const bizRef = doc(db, "businesses", storeId);
  const bizSnap = await getDoc(bizRef);

  if (!bizSnap.exists()) {
    return <div>Store not found</div>;
  }

  const biz = serializeFirestoreData(bizSnap.data());
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
