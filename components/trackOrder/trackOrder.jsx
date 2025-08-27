"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import styles from "./trackOrder.module.css";

const TrackOrder = ({ storeId }) => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTrack = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(db, "businesses", storeId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Store not found");
        setLoading(false);
        return;
      }

      const orders = docSnap.data()?.orders || [];
      const foundOrder = orders.find((o) => o.orderId === orderId.trim());

      if (!foundOrder) {
        toast.error("No valid order found");
        setLoading(false);
        return;
      }

      // Navigate to the order page
      router.push(`/${storeId}/order/${orderId.trim()}`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.trackContainer}>
      <h2 className={styles.header}>Track Your Order</h2>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="e.g. mnrt397..."
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className={styles.orderInput}
        />
        <button
          className={styles.trackBtn}
          onClick={handleTrack}
          disabled={loading}
        >
          {loading ? (
            <i className={`fa-solid fa-spinner ${styles.spinner}`}></i>
          ) : (
            "Track"
          )}
        </button>
      </div>
    </div>
  );
};

export default TrackOrder;
