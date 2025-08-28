"use client";

import { useEffect, useState } from "react";
import styles from "./Banner.module.css";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import fallbackBanner from "../../public/images/banner.jpeg";

const Banner = ({ storeId }) => {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animIndex, setAnimIndex] = useState(0);

  const animations = [
    { x: [0, 50, -50, 0], rotate: [0, 5, -5, 0], scale: [1, 1.2, 0.9, 1], duration: 1.2 },
    { y: [0, -20, 20, 0], rotate: [0, -10, 10, 0], scale: [1, 1.1, 1], duration: 1 },
    { x: [0, -60, 60, 0], rotate: [0, 8, -8, 0], scale: [1, 1.3, 1], duration: 1.5 },
    { y: [0, 30, -30, 0], rotate: [0, 15, -15, 0], scale: [1, 1.25, 1], duration: 1.2 },
    { x: [0, 20, -20, 0], rotate: [0, -5, 5, 0], scale: [1, 1.15, 1], duration: 0.9 },
    { y: [0, -15, 15, 0], rotate: [0, 12, -12, 0], scale: [1, 1.2, 1], duration: 1.1 },
  ];

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        if (!storeId) return;
        const businessSnap = await getDoc(doc(db, "businesses", storeId));
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

  // Cycle through animations every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimIndex((prev) => (prev + 1) % animations.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getAlignment = () => {
    switch (bannerData?.align) {
      case "center":
        return { left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "100%"};
      case "right":
        return { right: "5%", transform: "translateY(-50%)", textAlign: "right", width: "100%" };
      default:
        return { left: "5%", transform: "translateY(-50%)", textAlign: "left", width: "100%" };
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <i className="fa-solid fa-spinner fa-spin"></i>
      </div>
    );
  }

  const bannerImage = bannerData?.image || fallbackBanner;

  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.bannerImg}>
        <Image
          src={bannerImage}
          alt="store banner"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        {bannerData?.darkOverlay !== false && <div className={styles.darkOverlay}></div>}

        <div className={styles.texts} style={getAlignment()}>
          <AnimatePresence>
            {bannerData?.mainText && (
              <motion.h1
                key={animIndex + "-main"}
                animate={{
                  x: animations[animIndex].x,
                  y: animations[animIndex].y,
                  rotate: animations[animIndex].rotate,
                  scale: animations[animIndex].scale,
                }}
                transition={{ duration: animations[animIndex].duration, ease: "easeInOut" }}
              >
                {bannerData.mainText}
              </motion.h1>
            )}
            {bannerData?.subText && (
              <motion.p
                key={animIndex + "-sub"}
                animate={{
                  x: animations[(animIndex + 1) % animations.length].x,
                  y: animations[(animIndex + 1) % animations.length].y,
                  rotate: animations[(animIndex + 1) % animations.length].rotate,
                  scale: animations[(animIndex + 1) % animations.length].scale,
                }}
                transition={{
                  duration: animations[(animIndex + 1) % animations.length].duration,
                  ease: "easeInOut",
                }}
              >
                {bannerData.subText}
              </motion.p>
            )}
            {bannerData?.extraText && (
              <motion.p
                key={animIndex + "-extra"}
                className={styles.extraText}
                animate={{
                  x: animations[(animIndex + 2) % animations.length].x,
                  y: animations[(animIndex + 2) % animations.length].y,
                  rotate: animations[(animIndex + 2) % animations.length].rotate,
                  scale: animations[(animIndex + 2) % animations.length].scale,
                }}
                transition={{
                  duration: animations[(animIndex + 2) % animations.length].duration,
                  ease: "easeInOut",
                }}
              >
                {bannerData.extraText}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Banner;
