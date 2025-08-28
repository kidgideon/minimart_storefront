"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Messenger.module.css";

const Messenger = ({ storeId }) => {
  const [business, setBusiness] = useState(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ bottom: 20, right: 20 });
  const [direction, setDirection] = useState("up"); // "up" or "down"
  const dragRef = useRef(null);

  // Fetch business data
  useEffect(() => {
    if (!storeId) return;

    const fetchBusiness = async () => {
      try {
        const docSnap = await getDoc(doc(db, "businesses", storeId));
        if (docSnap.exists()) setBusiness(docSnap.data());
      } catch (err) {
        console.error("Error fetching business:", err);
      }
    };

    fetchBusiness();
  }, [storeId]);

  // Dragging behavior (Mouse + Touch)
  useEffect(() => {
    const dragEl = dragRef.current;
    if (!dragEl) return;

    let startX, startY, startRight, startBottom;

    const startDrag = (clientX, clientY) => {
      startX = clientX;
      startY = clientY;
      startRight = position.right;
      startBottom = position.bottom;
    };

    const doDrag = (clientX, clientY) => {
      const dx = clientX - startX;
      const dy = clientY - startY;

      setPosition({
        right: Math.max(0, startRight - dx),
        bottom: Math.max(0, startBottom - dy),
      });

      // Auto adjust direction if close to top
      const spaceBelow = window.innerHeight - (clientY + 80);
      setDirection(spaceBelow < 200 ? "down" : "up");
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", touchEnd);
    };

    // Mouse events
    const mouseDown = (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    };
    const mouseMove = (e) => doDrag(e.clientX, e.clientY);
    const mouseUp = stopDrag;

    // Touch events
    const touchStart = (e) => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
      document.addEventListener("touchmove", touchMove, { passive: false });
      document.addEventListener("touchend", touchEnd);
    };
    const touchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      doDrag(touch.clientX, touch.clientY);
    };
    const touchEnd = stopDrag;

    dragEl.addEventListener("mousedown", mouseDown);
    dragEl.addEventListener("touchstart", touchStart, { passive: false });

    return () => {
      dragEl.removeEventListener("mousedown", mouseDown);
      dragEl.removeEventListener("touchstart", touchStart);
    };
  }, [position]);

  if (!business) return null;

  // Build platforms
  const platforms = [];
  if (business.whatsappNumber?.replace) {
    platforms.push({
      name: "WhatsApp",
      url: `https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}`,
      icon: "fa-brands fa-whatsapp",
      color: "#25D366",
    });
  }
  if (business.instagramLink?.trim()) {
    platforms.push({
      name: "Instagram",
      url: business.instagramLink,
      icon: "fa-brands fa-instagram",
      color:
        "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    });
  }
  if (business.facebookLink?.trim()) {
    platforms.push({
      name: "Facebook",
      url: business.facebookLink,
      icon: "fa-brands fa-facebook",
      color: "#1877F2",
    });
  }
  if (business.tiktokLink?.trim()) {
    platforms.push({
      name: "TikTok",
      url: business.tiktokLink,
      icon: "fa-brands fa-tiktok",
      color: "#000000",
    });
  }

  if (!platforms.length) return null;

  return (
    <div
      className={styles.messengerContainer}
      style={{ bottom: `${position.bottom}px`, right: `${position.right}px` }}
    >
      <div
        ref={dragRef}
        className={`${styles.mainButton} ${open ? styles.open : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <i className="fa-solid fa-comment"></i>
      </div>

      {platforms.map((p, i) => (
        <a
          key={p.name}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.platformButton} ${open ? styles.show : ""}`}
          style={{
            background: p.color,
            transform:
              open && direction === "up"
                ? `translateY(-${(i + 1) * 80}px)` // increased spacing
                : open && direction === "down"
                ? `translateY(${(i + 1) * 80}px)` // increased spacing
                : "translateY(0)",
            transitionDelay: `${i * 80}ms`,
          }}
        >
          <i className={p.icon}></i>
        </a>
      ))}
    </div>
  );
};

export default Messenger;
