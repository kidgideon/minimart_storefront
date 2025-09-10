"use client";
import styles from "./page.module.css"

import dynamic from "next/dynamic";

// Import client components dynamically
const Navbar = dynamic(() => import("../../components/Navbar/Navbar"), { ssr: false });
const Banner = dynamic(() => import("../../components/Banner/Banner"), { ssr: false });
const Featured = dynamic(() => import("../../components/Featured/Featured"), { ssr: false });
const Latest = dynamic(() => import("../../components/Latest/Latest"), { ssr: false });
const Products = dynamic(() => import("../../components/Products/Products"), { ssr: false });
const Services = dynamic(() => import("../../components/Services/Services"), { ssr: false });
const Footer = dynamic(() => import("../../components/Footer/Footer"), { ssr: false });
const TrackOrder = dynamic(() => import("../../components/trackOrder/trackOrder"), { ssr: false });
const Messenger = dynamic(() => import("../../components/Messenger/Messenger"), { ssr: false });


export default function StorefrontClient({ storeId, biz, primary, secondary }) {
  return (
    <div
      style={{
        "--storePrimary": primary,
        "--storeSecondary": secondary,
      }} className={styles.storeInterface}
    >
      <Navbar storeId={storeId} />
      <Messenger storeId={storeId} />
      <Banner storeId={storeId} />
      <TrackOrder storeId={storeId}/>
      <Featured storeId={storeId} />
      <Latest storeId={storeId} />
      <Products storeId={storeId} />
      <Services storeId={storeId} />
      <Footer storeId={storeId} />
    </div>
  );
}
