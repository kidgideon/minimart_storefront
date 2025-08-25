// app/[storeId]/product/[id]/page.js
import Head from "next/head";
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import ProductPageClient from "./ProductPageClient"; // Client-side component
import fallback from "../../../../public/images/no_bg.png";

const DEFAULT_PRIMARY = "#1C2230";
const DEFAULT_SECONDARY = "#43B5F4";

// Helper: Convert Firestore data to plain JSON (fixes Timestamp issue)
function serializeFirestore(docData) {
  return JSON.parse(
    JSON.stringify(docData, (key, value) => {
      if (value?.seconds !== undefined && value?.nanoseconds !== undefined) {
        return new Date(value.seconds * 1000 + value.nanoseconds / 1e6).toISOString();
      }
      return value;
    })
  );
}

export default async function ProductPage({ params }) {
  const { storeId, id } = params;

  // --- Fetch business data ---
  const bizRef = doc(db, "businesses", storeId);
  const bizSnap = await getDoc(bizRef);
  if (!bizSnap.exists()) notFound();

  const biz = serializeFirestore(bizSnap.data());

  // --- Extract store colors ---
  const primary = biz.customTheme?.primaryColor?.trim() || DEFAULT_PRIMARY;
  const secondary = biz.customTheme?.secondaryColor?.trim() || DEFAULT_SECONDARY;

  // --- Find product or service ---
  let product = (biz.products || []).find((p) => p.prodId === id);
  if (product) {
    product._ft = "product";
  } else {
    product = (biz.services || []).find((s) => s.serviceId === id);
    if (product) product._ft = "service";
  }

  if (!product) notFound();

  const image = product.images?.[0] || fallback;

  return (
    <>
      <Head>
        <title>{product.name} | {biz.businessName}</title>
        <meta
          name="description"
          content={product.description || "Explore this product on Minimart."}
        />
        <meta
          property="og:title"
          content={`${product.name} | ${biz.businessName}`}
        />
        <meta
          property="og:description"
          content={product.description || ""}
        />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="product" />
        <meta
          property="og:url"
          content={`https://${storeId}.minimart.ng/product/${product._ft === "product" ? product.prodId : product.serviceId}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description || ""} />
        <meta name="twitter:image" content={image} />
        <link
          rel="icon"
          type="image/png"
          href={biz.customTheme?.logo || fallback}
        />
      </Head>

      <ProductPageClient
        storeId={storeId}
        biz={biz}
        product={product}
        primaryColor={primary}
        secondaryColor={secondary}
      />
    </>
  );
}
