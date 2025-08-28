"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, onSnapshot, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Image from "next/image";
import defaultLogo from "../../public/images/no_bg.png";
import styles from "./Navbar.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function useLocalCartCount(storeId) {
  const storageKey = `cart_${storeId}`;

  const parseCart = () => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return 0;
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object") {
        return Object.values(obj).reduce((sum, qty) => sum + qty, 0);
      }
    } catch {}
    return 0;
  };

  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(parseCart());
  }, [storeId]);

  const refresh = useCallback(() => {
    setCount(parseCart());
  }, [storeId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onStorage = (e) => {
      if (e.key === storageKey) refresh();
    };
    const onCartUpdated = (e) => {
      if (e.detail === storeId) refresh();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onCartUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onCartUpdated);
    };
  }, [refresh, storageKey, storeId]);

  return count;
}

export default function Navbar({ storeId }) {
  const [business, setBusiness] = useState(null);
  const [loadingBiz, setLoadingBiz] = useState(true);
  const [likedStore, setLikedStore] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [badgeKey, setBadgeKey] = useState(0);
  const [cartAnim, setCartAnim] = useState(false);

  const cartCount = useLocalCartCount(storeId);
  const localLikeKey = `liked_store_${storeId}`;
  const localVisitKey = `lastVisited_${storeId}`;

  // Fetch business data
  useEffect(() => {
    if (!storeId) return;
    setLoadingBiz(true);
    const bizRef = doc(db, "businesses", storeId);
    const unsub = onSnapshot(
      bizRef,
      (snap) => {
        setBusiness(snap.exists() ? snap.data() : null);
        setLoadingBiz(false);
      },
      (err) => {
        console.error("Failed to load business for navbar:", err);
        setLoadingBiz(false);
      }
    );
    return () => unsub();
  }, [storeId]);

  // Track likes
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(localLikeKey)) {
      setLikedStore(true);
    }
  }, [localLikeKey]);

  const toggleStoreLike = async () => {
    if (likedStore) return;

    try {
      const bizRef = doc(db, "businesses", storeId);
      const snap = await getDoc(bizRef);
      if (!snap.exists()) return;

      const currentLikes = snap.data().storeLike || 0;
      await updateDoc(bizRef, { storeLike: currentLikes + 1 });

      if (typeof window !== "undefined") {
        localStorage.setItem(localLikeKey, "true");
      }

      setLikedStore(true);
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 600);
    } catch (err) {
      console.error("Error liking store:", err);
    }
  };

  // Animate cart badge
  useEffect(() => {
    if (cartCount <= 0) return;
    setBadgeKey((prev) => prev + 1);
    setCartAnim(true);
    const t = setTimeout(() => setCartAnim(false), 600);
    return () => clearTimeout(t);
  }, [cartCount]);

  // Track daily page views using Firestore Timestamps
  useEffect(() => {
    if (!storeId || typeof window === "undefined") return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().split("T")[0];
    const lastVisited = localStorage.getItem(localVisitKey);

    if (lastVisited === todayKey) return;

    const updatePageViews = async () => {
      try {
        const bizRef = doc(db, "businesses", storeId);
        const snap = await getDoc(bizRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const pageViews = data.pageViews || [];

        const todayIndex = pageViews.findIndex((entry) => {
          if (!entry.date) return false;
          let entryDate;
          if (entry.date.toDate) {
            // Firestore Timestamp
            entryDate = entry.date.toDate();
          } else {
            // Fallback if plain string
            entryDate = new Date(entry.date);
          }
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime();
        });

        if (todayIndex >= 0) {
          pageViews[todayIndex].views = (pageViews[todayIndex].views || 0) + 1;
        } else {
          pageViews.push({
            views: 1,
            date: Timestamp.now(),
          });
        }

        await updateDoc(bizRef, { pageViews });
        localStorage.setItem(localVisitKey, todayKey);
      } catch (err) {
        console.error("Error updating page views:", err);
      }
    };

    updatePageViews();
  }, [storeId, localVisitKey]);

  const displayName = business?.businessName || storeId;
  const logoSrc = business?.customTheme?.logo || defaultLogo;

  return (
    <div className={styles.navbarInterface}>
      <div className={styles.companyArea}>
        <div className={styles.imageDiv}>
          {loadingBiz ? (
            <i className="fa-solid fa-spinner fa-spin" />
          ) : (
            <Link href={`/${storeId}`}>
              <Image src={logoSrc} alt="store logo" width={50} height={50} />
            </Link>
          )}
        </div>
        <p className={styles.storeName}>{displayName}</p>
      </div>

      <div className={styles.cartArea}>
        <motion.div
          className={`${styles.heart} ${likedStore ? styles.heartLiked : ""}`}
          onClick={toggleStoreLike}
          animate={likeAnim ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={likedStore ? { pointerEvents: "none", opacity: 0.75 } : {}}
        >
          <i className="fa-solid fa-heart" />
        </motion.div>

        <motion.div
          className={styles.cart}
          animate={
            cartAnim
              ? { rotate: [0, 15, -10, 0], scale: [1, 1.1, 0.95, 1] }
              : {}
          }
          transition={{ duration: 0.6 }}
        >
          <Link href="/cart">
            <i className="fa-solid fa-cart-shopping" />
          </Link>
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.div
                key={badgeKey}
                initial={{ y: 20, scale: 0, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={styles.badge}
              >
                +{cartCount}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
