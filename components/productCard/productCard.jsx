"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./productCard.module.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase"; // <- point to your Next.js firebase init
import { v4 as uuidv4 } from "uuid";

export default function ProductCard({ storeId, item }) {
  const [curImg, setCurImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const images = item.images || [];
  const isProduct = item._ft === "product";
  const id = isProduct ? item.prodId : item.serviceId;
  const localLikeKey = `${item._ft}_${id}`;
  const cartKey = `cart_${storeId}`;

  // image slider
  useEffect(() => {
    if (!images.length) return;
    const iv = setInterval(() => {
      setCurImg((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(iv);
  }, [images]);

  // restore liked state
  useEffect(() => {
    const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
    if (likedProducts.includes(localLikeKey)) {
      setLiked(true);
      setLikeDisabled(true);
    }
  }, [localLikeKey]);

  // sync quantity from localStorage + listen for cart updates
  useEffect(() => {
    const updateQty = () => {
      const cart = JSON.parse(localStorage.getItem(cartKey)) || {};
      setQuantity(cart[id] || 0);
    };
    updateQty();

    const onCartUpdate = (e) => {
      if (e.detail === storeId) updateQty();
    };
    window.addEventListener("cartUpdated", onCartUpdate);
    return () => window.removeEventListener("cartUpdated", onCartUpdate);
  }, [cartKey, id, storeId]);

  const dispatchCartUpdate = () => {
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: storeId }));
  };

  const incCart = () => {
    const cartId = localStorage.getItem("cartId") || uuidv4();
    let cart = JSON.parse(localStorage.getItem(cartKey)) || {};

    cart[id] = (cart[id] || 0) + 1;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    localStorage.setItem("cartId", cartId);

    let analysis = JSON.parse(localStorage.getItem("cartAnalysis")) || {};
    if (!analysis[cartId]) {
      analysis[cartId] = { open: true, closed: false, products: [id] };
    } else if (!analysis[cartId].products.includes(id)) {
      analysis[cartId].products.push(id);
    }
    localStorage.setItem("cartAnalysis", JSON.stringify(analysis));

    setQuantity(cart[id]);
    dispatchCartUpdate();
    console.log("Cart after adding:", cart);
  };

  const decCart = () => {
    let cart = JSON.parse(localStorage.getItem(cartKey)) || {};
    if (!cart[id]) return;

    if (cart[id] <= 1) {
      delete cart[id];
    } else {
      cart[id] -= 1;
    }

    if (Object.keys(cart).length === 0) {
      localStorage.removeItem(cartKey);
    } else {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    setQuantity(cart[id] || 0);
    dispatchCartUpdate();
    console.log("Cart after removing:", cart);
  };

  const toggleLike = async () => {
    if (likeDisabled) return;

    try {
      const bizRef = doc(db, "businesses", storeId);
      const snap = await getDoc(bizRef);
      const biz = snap.data() || {};

      const key = isProduct ? "products" : "services";
      const idKey = isProduct ? "prodId" : "serviceId";
      const arr = biz[key] || [];

      const updatedArr = arr.map((p) => {
        if (p[idKey] === id) {
          return { ...p, likes: (p.likes || 0) + 1 };
        }
        return p;
      });

      await updateDoc(bizRef, { [key]: updatedArr });

      let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
      if (!likedProducts.includes(localLikeKey)) {
        likedProducts.push(localLikeKey);
        localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
      }

      setLiked(true);
      setLikeDisabled(true);
    } catch (err) {
      console.error("Error liking product:", err);
    }
  };

  const handleShare = async () => {
    // Build a share URL that matches your Next.js route structure
    const base = typeof window !== "undefined" ? window.location.origin : "https://minimart.ng";
    const shareUrl = `${base}/${storeId}/product/${id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.name,
          text: item.description || "Check out this product",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
      alert("Unable to share this product.");
    }
  };

  return (
    <div className={styles.product}>
      <div className={styles.productImages}>
        <Link href={`/${storeId}/product/${id}`}>
          <img
            src={images[curImg] || ""}
            alt={item.name}
          />
        </Link>

        <div className={styles.sliderDots}>
          {images.map((_, i) => (
            <span
              key={i}
              className={i === curImg ? styles.activeDot : styles.dot}
              onClick={() => setCurImg(i)}
            />
          ))}
        </div>
      </div>

      <div
        className={`${styles.heartproduct} ${liked ? styles.heartLiked : ""}`}
        onClick={toggleLike}
        style={likeDisabled ? { pointerEvents: "none", opacity: 0.6 } : {}}
      >
        <i className={`fa-solid fa-heart ${liked ? styles.liked : ""}`}></i>
      </div>

      <div className={styles.productInfo}>
        <p className={styles.productName}>{item.name}</p>
        <p className={styles.price}>₦{(item.price || 0).toLocaleString()}</p>

        <p className={styles.description}>
          {`${item.description?.slice(0, 50) ?? ""}${item.description?.length > 50 ? "..." : ""}`}
        </p>

        <div className={styles.catAndShare}>
          <p className={styles.category}><span>{item.category}</span></p>
          <i
            className="fa-solid fa-share-nodes"
            onClick={handleShare}
            style={{ cursor: "pointer" }}
          ></i>
        </div>

        <div className={styles.btnArea}>
          {quantity > 0 ? (
            <>
              <button className={styles.dCBtn} onClick={decCart}>–</button>
              <span className={styles.qtySpan}>{quantity}</span>
              <button className={styles.dCBtn} onClick={incCart}>+</button>
            </>
          ) : (
            <button className={styles.btn} onClick={incCart}>Add to cart</button>
          )}
        </div>
      </div>
    </div>
  );
}
