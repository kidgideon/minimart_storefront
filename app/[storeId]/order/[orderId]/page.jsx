"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter, useParams } from "next/navigation"; // FIXED
import Receipt from "../../../../components/Reciept/Reciept";
import Navbar from "../../../../components/Navbar/Navbar";
import Messenger from "../../../../components/Messenger/Messenger";
import styles from "./page.module.css";
import useStoreTheme from "../../../../hooks/useStoreTheme";

import fallback from "../../../../public/images/no_bg.png";

import { db } from "../../../../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import axios from "axios";
import { toast } from "sonner";

const Order = () => {
  const router = useRouter();
  const params = useParams(); // FIXED
  const storeId = params?.storeId;
  const orderId = params?.orderId;

  const { biz, loading, error } = useStoreTheme(storeId);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [orderSaved, setOrderSaved] = useState(false);
  const [savingOrder, setSavingOrder] = useState(true);

  useEffect(() => {
    if (!storeId) router.push("/");
  }, [storeId, router]);

  useEffect(() => {
    if (biz) {
      const primary = biz.customTheme?.primaryColor?.trim() || DEFAULT_PRIMARY;
      const secondary = biz.customTheme?.secondaryColor?.trim() || DEFAULT_SECONDARY;
     
    }
  }, [biz]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load store.");
      router.push("/");
    }
  }, [error, router]);

  // Verify payment and sync order
  useEffect(() => {
    const verifyPaymentAndSaveOrder = async () => {
      setSavingOrder(true);
      try {
        const res = await axios.get(
          `https://minimart-backend.vercel.app/api/paystack/verify/${orderId}`
        );
        const paystackData = res.data?.data;

        let newStatus = "declined";
        if (paystackData?.status === "success") newStatus = "paid";
        else if (paystackData?.status === "pending") newStatus = "pending";

        setPaymentStatus(newStatus);

        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          const cartKey = `cart_${storeId}`;
          const cartObj = JSON.parse(localStorage.getItem(cartKey)) || {};

          const allItems = [
            ...(biz.products || []).map((p) => ({ ...p, _ft: "product" })),
            ...(biz.services || []).map((s) => ({ ...s, _ft: "service" })),
          ];

          const products = Object.entries(cartObj)
            .map(([id, qty]) => {
              const found = allItems.find((i) =>
                i._ft === "product" ? i.prodId === id : i.serviceId === id
              );
              return found ? { ...found, quantity: qty } : null;
            })
            .filter(Boolean);

          const amount = products.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0
          );

          const checkoutInfoKey = `checkout_info_${storeId}`;
          const checkoutInfo = JSON.parse(localStorage.getItem(checkoutInfoKey)) || {};

          await setDoc(orderRef, {
            orderId,
            storeId,
            date: new Date().toISOString(),
            status: newStatus,
            paymentInfo: paystackData || null,
            products,
            amount,
            customerInfo: checkoutInfo,
            completed: false,
            cancelled: false,
          });

          const bizRef = doc(db, "businesses", storeId);
          await updateDoc(bizRef, {
            orders: arrayUnion({ orderId, date: new Date().toISOString() }),
            notifications: arrayUnion({
              date: new Date().toISOString(),
              link: `/orders/order/${orderId}`,
              read: false,
              text: `New order ${orderId} has been placed`,
            }),
          });
        } else {
          await updateDoc(orderRef, {
            status: newStatus,
            paymentInfo: paystackData || null,
            updatedAt: new Date().toISOString(),
          });
        }

        if (newStatus === "paid") {
          localStorage.removeItem(`cart_${storeId}`);
          localStorage.removeItem(`checkout_${storeId}`);
          localStorage.removeItem(`checkout_info_${storeId}`);
        }

        setOrderSaved(true);
      } catch (err) {
        console.error("Payment verification failed", err);
        setPaymentStatus("declined");
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
          status: "declined",
          updatedAt: new Date().toISOString(),
        });
        setOrderSaved(true);
      } finally {
        setSavingOrder(false);
      }
    };

    if (orderId && biz) verifyPaymentAndSaveOrder();
  }, [orderId, storeId, biz]);

  if (loading || savingOrder) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32 }}></i>
      </div>
    );
  }

  if (!biz) return null;

  const title = `${biz.businessName || "Minimart Store"} - Order`;
  const description = biz.otherInfo?.description || "Track your orders and view status";
  const logo = biz.customTheme?.logo || fallback;
  const url = `https://${storeId}.minimart.ng/order/${orderId}`;

  return (
    <div className={styles.interface}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={logo} />
        <meta property="og:url" content={url} />
        <meta
          name="theme-color"
          content={biz.customTheme?.primaryColor || DEFAULT_PRIMARY}
        />
        <link rel="icon" type="image/png" href={logo} />
      </Head>

      <Navbar storeId={storeId} />
      <Messenger storeId={storeId}/>

      {orderSaved && paymentStatus === "paid" ? (
        <Receipt storeId={storeId} orderId={orderId} showInfo={true} status={paymentStatus} />
      ) : (
        <div className={styles.orderStatus}>
          {orderSaved && paymentStatus === "declined" ? (
            <>
              <i className="fa-solid fa-circle-xmark" style={{ fontSize: 64, color: "red" }}></i>
              <p>Your order was declined. Please try again.</p>
              <button
                onClick={() => router.push(`/checkout/${orderId}`)}
                className={styles.retryBtn}
              >
                Retry Payment
              </button>
            </>
          ) : null}
        </div>
      )}

    </div>
  );
};

export default Order;
