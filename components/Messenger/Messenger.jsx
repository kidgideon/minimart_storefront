"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Messenger.module.css";

const Messenger = ({ storeId }) => {
  const [business, setBusiness] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch business platforms
  useEffect(() => {
    if (!storeId) return;

    const fetchBusiness = async () => {
      try {
        const docSnap = await getDoc(doc(db, "businesses", storeId));
        if (docSnap.exists()) {
          setBusiness(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching business:", err);
      }
    };

    fetchBusiness();
  }, [storeId]);

  if (!business) return null;

  // Generate available platforms safely
  const platforms = [];

  if (business.whatsappNumber?.replace) {
    platforms.push({
      name: "WhatsApp",
      url: `https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}`,
      icon: "fa-brands fa-whatsapp",
    });
  }

  if (business.instagramLink?.trim()) {
    platforms.push({
      name: "Instagram",
      url: business.instagramLink,
      icon: "fa-brands fa-instagram",
    });
  }

  if (business.facebookLink?.trim()) {
    platforms.push({
      name: "Facebook",
      url: business.facebookLink,
      icon: "fa-brands fa-facebook",
    });
  }

  if (business.tiktokLink?.trim()) {
    platforms.push({
      name: "TikTok",
      url: business.tiktokLink,
      icon: "fa-brands fa-tiktok",
    });
  }

  // YouTube intentionally removed

  if (!platforms.length) return null;

  return (
    <div className={styles.messengerContainer}>
      {/* Floating main icon */}
      <div
        className={`${styles.mainButton} ${open ? styles.open : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <i className="fa-solid fa-comment"></i>
      </div>

      {/* Platform buttons */}
      {platforms.map((p, i) => (
        <a
          key={p.name || `platform-${i}`}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.platformButton} ${open ? styles.show : ""}`}
          style={{
            transform: open
              ? `translate(-${(i + 1) * 70}px, 0)`
              : "translate(0, 0)",
            transitionDelay: `${i * 100}ms`,
          }}
        >
          <i className={p.icon}></i>
        </a>
      ))}
    </div>
  );
};

export default Messenger;
