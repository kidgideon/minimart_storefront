"use client";

import { useEffect, useState } from "react";
import styles from "./Latest.module.css";
import ProductCard from "../productCard/productCard"
import { db } from "../../lib/firebase"; // adjust if needed
import { doc, getDoc } from "firebase/firestore";

const Latest = ({ storeId }) => {
  const [latestItems, setLatestItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    const fetchLatestItems = async () => {
      setLoading(true);

      try {
        const snap = await getDoc(doc(db, "businesses", storeId));

        if (snap.exists()) {
          const data = snap.data();
          const products = (data.products || []).map((p) => ({
            ...p,
            _ft: "product",
          }));
          const services = (data.services || []).map((s) => ({
            ...s,
            _ft: "service",
          }));

          const combined = [...products, ...services]
            .filter((item) => item.dateAdded)
            .sort((a, b) => {
              const dateA = new Date(a.dateAdded).getTime();
              const dateB = new Date(b.dateAdded).getTime();
              return dateB - dateA;
            })
            .slice(0, 10);

          setLatestItems(combined);
        } else {
          setLatestItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch latest items:", error);
        setLatestItems([]);
      }

      setLoading(false);
    };

    fetchLatestItems();
  }, [storeId]);

  return (
    <div className={styles.latestWrapper}>
      <h1 className={styles.heading}>Latest Items</h1>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : latestItems.length > 0 ? (
        <div className={styles.scrollContainer}>
          {latestItems.map((item) => {
            const key = item.prodId || item.serviceId;
            return (
              <ProductCard
                key={key}
                storeId={storeId}
                item={item}
              />
            );
          })}
        </div>
      ) : (
        <p className={styles.empty}>No latest items available.</p>
      )}
    </div>
  );
};

export default Latest;
