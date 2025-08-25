// app/[storeId]/product/[id]/ProductPageClient.jsx
"use client";

import dynamic from "next/dynamic";
import styles from "./page.module.css";

const Navbar = dynamic(() => import("../../../../components/Navbar/Navbar"), { ssr: false });
const Featured = dynamic(() => import("../../../../components/Featured/Featured"), { ssr: false });
const Products = dynamic(() => import("../../../../components/Products/Products"), { ssr: false });
const Services = dynamic(() => import("../../../../components/Services/Services"), { ssr: false });
const Footer = dynamic(() => import("../../../../components/Footer/Footer"), { ssr: false });
const ProductDetailClient = dynamic(() => import("../../../../components/productDetail/ProductDetailClient"), { ssr: false });

export default function ProductPageClient({ storeId, biz, product, primaryColor, secondaryColor}) {
  return (
    <div  style={{
        "--storePrimary": primaryColor,
        "--storeSecondary": secondaryColor,
      }} className={styles.wrapper}>
      <Navbar storeId={storeId} />
      <ProductDetailClient storeId={storeId} product={product} biz={biz} />
      <Featured storeId={storeId} />
      <Products storeId={storeId} />
      <Services storeId={storeId} />
      <Footer storeId={storeId} />
    </div>
  );
}
