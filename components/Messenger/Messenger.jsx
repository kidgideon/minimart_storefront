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
        if (docSnap.exists()) setBusiness(docSnap.data());
      } catch (err) {
        console.error(err);
      }
    };
    fetchBusiness();
  }, [storeId]);

  if (!business) return null;

  // Generate available platforms
  const platforms = [];
  if (business.whatsappNumber)
    platforms.push({
      name: "WhatsApp",
      url: `https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}`,
      icon: "fa-brands fa-whatsapp",
    });
  if (business.instagramLink)
    platforms.push({
      name: "Instagram",
      url: business.instagramLink,
      icon: "fa-brands fa-instagram",
    });
  if (business.facebookLink)
    platforms.push({
      name: "Facebook",
      url: business.facebookLink,
      icon: "fa-brands fa-facebook",
    });
  if (business.tikTokLink)
    platforms.push({
      name: "TikTok",
      url: business.tikTokLink,
      icon: "fa-brands fa-tiktok",
    });
  if (business.youtubeLink)
    platforms.push({
      name: "YouTube",
      url: business.youtubeLink,
      icon: "fa-brands fa-youtube",
    });

  if (platforms.length === 0) return null; // no platforms to show

  return (
    <div className={styles.messengerContainer}>
      {/* Floating main icon */}
      <div
        className={`${styles.mainButton} ${open ? styles.open : ""}`}
        onClick={() => setOpen(!open)}
      >
        <i className="fa-solid fa-comment"></i>
      </div>

      {/* Platform buttons */}
      {platforms.map((p, i) => (
        <a
          key={p.name}
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className={`${styles.platformButton} ${open ? styles.show : ""}`}
          style={{
            transform: `translate(-${(i + 1) * 60}px, 0)`, // horizontal offset
            transitionDelay: `${i * 50}ms`, // staggered animation
          }}
        >
          <i className={p.icon}></i>
        </a>
      ))}
    </div>
  );
};

export default Messenger;
