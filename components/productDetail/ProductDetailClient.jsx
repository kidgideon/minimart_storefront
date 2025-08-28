"use client";

import { useEffect, useState } from "react";
import styles from "./productDetail.module.css"; // create this or reuse your existing styles
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import ProductCard from "../../components/productCard/productCard"; // adjust path if needed

export default function ProductDetailClient({ storeId, product, biz }) {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [curImg, setCurImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const cartKey = `cart_${storeId}`;
  const localLikeKey = `${product._ft}_${product.prodId || product.serviceId}`;

  // Initialize quantity
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || {};
    const itemId = product.prodId || product.serviceId;
    setQuantity(cart[itemId] || 0);
  }, [cartKey, product]);

  // Similar products & likes
  useEffect(() => {
    if (!product || !biz) return;

    const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
    if (likedProducts.includes(localLikeKey)) {
      setLiked(true);
      setLikeDisabled(true);
    }

    if (product._ft === "product") {
      const sameCategory = (biz.products || [])
        .filter(p => p.category === product.category && p.prodId !== product.prodId)
        .map(p => ({ ...p, _ft: "product" }));
      setSimilarProducts(sameCategory);
    }
  }, [product, biz, localLikeKey]);

  const dispatchCartUpdate = () => {
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: storeId }));
  };

  const toggleLike = async () => {
    if (likeDisabled) return;

    try {
      const key = product._ft === "product" ? "products" : "services";
      const idKey = key === "products" ? "prodId" : "serviceId";
      const bizRef = doc(db, "businesses", storeId);
      const snap = await getDoc(bizRef);
      const data = snap.data();

      const arr = data[key] || [];
      const updated = arr.map(p => {
        if (p[idKey] === (product.prodId || product.serviceId)) {
          return { ...p, likes: (p.likes || 0) + 1 };
        }
        return p;
      });

      await updateDoc(bizRef, { [key]: updated });

      const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
      likedProducts.push(localLikeKey);
      localStorage.setItem("likedProducts", JSON.stringify(likedProducts));

      setLiked(true);
      setLikeDisabled(true);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const incCart = () => {
    const itemId = product.prodId || product.serviceId;
    const cartId = localStorage.getItem("cartId") || uuidv4();
    let cart = JSON.parse(localStorage.getItem(cartKey)) || {};
    cart[itemId] = (cart[itemId] || 0) + 1;

    localStorage.setItem(cartKey, JSON.stringify(cart));
    localStorage.setItem("cartId", cartId);

    let analysis = JSON.parse(localStorage.getItem("cartAnalysis")) || {};
    if (!analysis[cartId]) {
      analysis[cartId] = { open: true, closed: false, products: [itemId] };
    } else if (!analysis[cartId].products.includes(itemId)) {
      analysis[cartId].products.push(itemId);
    }
    localStorage.setItem("cartAnalysis", JSON.stringify(analysis));

    setQuantity(cart[itemId]);
    dispatchCartUpdate();
  };

  const decCart = () => {
    const itemId = product.prodId || product.serviceId;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || {};
    if (!cart[itemId]) return;

    if (cart[itemId] <= 1) delete cart[itemId];
    else cart[itemId] -= 1;

    if (Object.keys(cart).length === 0) localStorage.removeItem(cartKey);
    else localStorage.setItem(cartKey, JSON.stringify(cart));

    setQuantity(cart[itemId] || 0);
    dispatchCartUpdate();
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return alert("Native share not supported");

    try {
      await navigator.share({
        url: window.location.href,
      });
    } catch (err) {
      console.error("Share failed:", err);
      alert("Share failed: " + err.message);
    }
  };

  return (
    <div className={styles.top}>
      <div className={styles.left}>
        <img src={product.images?.[curImg]} alt="product" className={styles.mainImg} />
        <div className={styles.thumbRow}>
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              className={`${styles.thumb} ${i === curImg ? styles.active : ""}`}
              onClick={() => setCurImg(i)}
            />
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.price}>₦{(product.price || 0).toLocaleString()}</p>
        <p className={styles.desc}>{product.description}</p>
        <p className={styles.category}>{product.category}</p>

        <div className={styles.cart}>
          {quantity > 0 ? (
            <>
              <button onClick={decCart}>–</button>
              <span>{quantity}</span>
              <button onClick={incCart}>+</button>
            </>
          ) : (
            <button onClick={incCart}>Add to Cart</button>
          )}
        </div>

        <div className={styles.actions}>
          <button className={liked ? styles.liked : ""} onClick={toggleLike}>
            <i className="fa-solid fa-heart"></i> {liked ? "Liked" : "Like"}
          </button>
          <button onClick={handleNativeShare}>
            <i className="fa-solid fa-share-nodes"></i> Share
          </button>
        </div>

        {biz.refundPolicy && (
          <div className={styles.section}>
            <strong>Refunds:</strong> {biz.refundPolicy}
          </div>
        )}
        {biz.shippingPolicy && (
          <div className={styles.section}>
            <strong>Shipping:</strong> {biz.shippingPolicy}
          </div>
        )}
      </div>

      {similarProducts.length > 0 && (
        <div className={styles.similarWrapper}>
          <h1 className={styles.sectionTitle}>Similar Products</h1>
          <div className={styles.similarList}>
            {similarProducts.map(item => (
              <ProductCard key={item.prodId} storeId={storeId} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
