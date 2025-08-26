"use client";

import { useEffect, useState } from "react";
import styles from "./Banner.module.css";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import fallbackBanner from "../../public/images/banner.jpeg";

const Banner = ({ storeId }) => {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        if (!storeId) return;

        const businessRef = doc(db, "businesses", storeId);
        const businessSnap = await getDoc(businessRef);

        if (!businessSnap.exists()) return;

        const layout = businessSnap.data()?.layoutThemes?.topBanner || {};
        setBannerData(layout);
      } catch (err) {
        console.error("Failed to fetch banner data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [storeId]);

  const getAlignment = () => {
    switch (bannerData?.align) {
      case "center":
        return {
          width: "100%",
          textAlign: "center",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
      case "right":
        return {
          textAlign: "right",
          right: "5%",
          transform: "translateY(-50%)",
        };
      default:
        return {
          textAlign: "left",
          left: "5%",
          transform: "translateY(-50%)",
        };
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <i className="fa-solid fa-spinner fa-spin"></i>
      </div>
    );
  }

  // Choose banner image (fallback if missing)
  const bannerImage = bannerData?.image || fallbackBanner;

  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.bannerImg}>
        <Image
          src={bannerImage}
          alt="store banner"
          fill // replaces layout="fill"
          style={{ objectFit: "cover" }} // replaces objectFit="cover"
          priority
        />
        {bannerData?.darkOverlay !== false && (
          <div className={styles.darkOverlay}></div>
        )}
        <div className={styles.texts} style={getAlignment()}>
          {bannerData?.mainText && <h1>{bannerData.mainText}</h1>}
          {bannerData?.subText && <p>{bannerData.subText}</p>}
          {bannerData?.extraText && (
            <p className={styles.extraText}>{bannerData.extraText}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
