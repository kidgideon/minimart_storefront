"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import Navbar from "../../../components/Navbar/Navbar";
import Featured from "../../../components/Featured/Featured";
import Products from "../../../components/Products/Products";
import Services from "../../../components/Services/Services";
import Footer from "../../../components/Footer/Footer";

import useStoreTheme from "../../../hooks/useStoreTheme"; 
import styles from "./page.module.css";

const DEFAULT_PRIMARY = "#1C2230";
const DEFAULT_SECONDARY = "#43B5F4";
const DEFAULT_IMAGE = "/images/no_bg.png"; // fallback image

const applyThemeToRoot = (primary, secondary) => {
  document.documentElement.style.setProperty("--storePrimary", primary || DEFAULT_PRIMARY);
  document.documentElement.style.setProperty("--storeSecondary", secondary || DEFAULT_SECONDARY);
};

export default function CartClient({ storeId }) {
  const router = useRouter();
  const { biz, loading, error } = useStoreTheme(storeId);

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const cartKey = `cart_${storeId}`;

  // redirect if storeId missing
  useEffect(() => {
    if (!storeId) router.push("/");
  }, [storeId, router]);

  // Apply theme and load cart after biz is ready
  useEffect(() => {
    if (biz) {
      const primary = biz.customTheme?.primaryColor?.trim() || DEFAULT_PRIMARY;
      const secondary = biz.customTheme?.secondaryColor?.trim() || DEFAULT_SECONDARY;
      applyThemeToRoot(primary, secondary);
      loadCartData(biz);
    }
  }, [biz]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error("Failed to load store.");
      router.push("/");
    }
  }, [error, router]);

  // Load cart from localStorage
  const loadCartData = (bizData) => {
    const cart = JSON.parse(localStorage.getItem(cartKey)) || {};
    if (!Object.keys(cart).length) {
      setCartItems([]);
      setSubtotal(0);
      return;
    }

    const allItems = [
      ...(bizData.products || []).map((p) => ({ ...p, _ft: "product" })),
      ...(bizData.services || []).map((s) => ({ ...s, _ft: "service" })),
    ];

    const itemsInCart = Object.entries(cart)
      .map(([id, qty]) => {
        const found = allItems.find((i) =>
          i._ft === "product" ? i.prodId === id : i.serviceId === id
        );
        if (!found) return null;
        return { ...found, quantity: qty };
      })
      .filter(Boolean);

    setCartItems(itemsInCart);

    const total = itemsInCart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    setSubtotal(total);
  };

  // Update quantity in cart
  const updateCartQuantity = (id, change) => {
    let cart = JSON.parse(localStorage.getItem(cartKey)) || {};
    cart[id] = (cart[id] || 0) + change;

    if (cart[id] <= 0) delete cart[id];

    if (Object.keys(cart).length === 0) {
      localStorage.removeItem(cartKey);
    } else {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: storeId }));
    if (biz) loadCartData(biz);
  };

  // Proceed to checkout
  const handleCheckout = () => {
    const checkoutKey = `checkout_${storeId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || {};

    const updatedCheckoutItems = cartItems.filter((item) => {
      const id = item._ft === "product" ? item.prodId : item.serviceId;
      return cart[id] !== undefined;
    });

    localStorage.setItem(checkoutKey, JSON.stringify(updatedCheckoutItems));

    const orderId = "mnrt" + uuidv4().replace(/-/g, "").slice(0, 10);
    router.push(`/checkout/${orderId}`);
  };

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
      }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32 }}></i>
      </div>
    );
  }

  if (!biz) return null;

  return (
    <div className={styles.cartArea}>
      <Navbar storeId={storeId} />

      <div className={styles.cartItems}>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item, idx) => {
              const id = item._ft === "product" ? item.prodId : item.serviceId;
              const safeKey = id || item.name || idx;
              const quantity = item.quantity || 1;
              const imageSrc = item.images?.[0] || DEFAULT_IMAGE;

              return (
                <div key={safeKey} className={styles.item}>
                  <div className={styles.top}>
                    <div className={styles.itemImage}>
                      <img src={imageSrc} alt={item.name || "item"} />
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemDetails}>
                        <div className={styles.itemName}>{item.name || "Unnamed Item"}</div>
                        <div className={styles.itemDescription}>{item.description || ""}</div>
                        <div className={styles.itemCategory}>{item.category || ""}</div>
                      </div>
                    </div>
                    <div className={styles.priceArea}>
                      ₦{((item.price || 0) * quantity).toLocaleString()}
                    </div>
                  </div>

                  <div className={styles.bottom}>
                    <div className={styles.remove}>
                      <button onClick={() => updateCartQuantity(id, -quantity)}>
                        <i className="fa-solid fa-trash"></i> Remove
                      </button>
                    </div>
                    <div className={styles.cartToggle}>
                      <button onClick={() => updateCartQuantity(id, -1)}>–</button>
                      <p className={styles.quantity}>{quantity}</p>
                      <button onClick={() => updateCartQuantity(id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className={styles.cartSummary}>
              <div className={styles.head}>
                <p>Cart Summary</p>
              </div>

              <div className={styles.subTotal}>
                <p>Subtotal</p>
                <p className={styles.overallPrice}>₦{subtotal.toLocaleString()}</p>
              </div>

              <div className={styles.checkoutBtn}>
                <button onClick={handleCheckout}>Checkout</button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.cartEmpty}>
            <div><i className="fa-solid fa-cart-shopping"></i></div>
            <p>Cart is empty</p>
          </div>
        )}
      </div>

      <Featured storeId={storeId} />
      <Products storeId={storeId} />
      <Services storeId={storeId} />
      <Footer storeId={storeId} />
    </div>
  );
}
