"use client";

import { useEffect, useState } from "react";
import styles from "./Featured.module.css";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ProductCard from "../productCard/productCard";

const Featured = ({ storeId }) => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    if (!storeId) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "businesses", storeId));
        if (!snap.exists()) return;

        const biz = snap.data();
        let arr = [];

        if (Array.isArray(biz.featured)) {
          arr = biz.featured
            .map((f) => {
              const src =
                f.type === "product"
                  ? biz.products?.find((p) => p.prodId === f.id)
                  : biz.services?.find((s) => s.serviceId === f.id);

              return src ? { ...src, _ft: f.type } : null;
            })
            .filter(Boolean)
            .sort((a, b) => {
              const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
              const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
              return dateB - dateA;
            });
        }

        setItems(arr);

        if (typeof window !== "undefined") {
          const storedCart =
            JSON.parse(localStorage.getItem(`cart_${storeId}`)) || {};
          setCart(storedCart);
        }
      } catch (error) {
        console.error("Error loading featured items:", error);
      }
    };

    load();
  }, [storeId]);

  const refreshCart = () => {
    if (typeof window === "undefined") return;
    const updatedCart =
      JSON.parse(localStorage.getItem(`cart_${storeId}`)) || {};
    setCart(updatedCart);
  };

  // If there are no featured items, render nothing at all
  if (!items.length) return null;

  const featuredType =
    items.every((it) => it._ft === "service") ? "Services" : "Products";

  return (
    <div className={styles.featured}>
      <div className={styles.Intro}>
        <p className={styles.introText}>Featured {featuredType}</p>
      </div>
      <div className={styles.slidableArea}>
        {items.map((item) => {
          const itemId =
            item._ft === "product" ? item.prodId : item.serviceId;
          return (
            <ProductCard
              key={itemId}
              storeId={storeId}
              item={item}
              quantity={cart[itemId] || 0}
              onCartChange={refreshCart}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Featured;
