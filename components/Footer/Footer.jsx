"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./Footer.module.css";

const Footer = ({ storeId }) => {
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchBusiness = async () => {
      try {
        const docSnap = await getDoc(doc(db, "businesses", storeId));
        if (docSnap.exists()) {
          setBusiness(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching business data:", error);
      }
    };

    fetchBusiness();
  }, [storeId]);

  if (!business) return null;

  const {
    businessName = "Our Store",
    otherInfo = {},
    instagramLink,
    tikTokLink,
    whatsappNumber,
    youtubeLink,
    businessEmail,
  } = business;

  const renderValue = (val) => {
    if (typeof val === "object") {
      return Object.entries(val).map(([k, v]) => (
        <span key={k} className={styles.nestedItem}>
          <b>{k}:</b> {v}{" "}
        </span>
      ));
    }
    return val;
  };

  return (
    <footer className={styles.footer}>

      {/* Top Section */}
      <div className={styles.topSection}>
        <div className={styles.about}>
  <h3>{businessName || "Our Store"}</h3>

  {/* Description with fallback */}
  <p>
    {otherInfo?.description
      ? otherInfo.description
      : "We are dedicated to providing quality products and services to all our customers."}
  </p>

  {/* Location with fallback */}
  <p>
    <i className="fa-solid fa-location-dot"></i>{" "}
    {otherInfo?.storeLocation || "Serving customers across various locations."}
  </p>
</div>

        <div className={styles.contact}>
          {businessEmail && (
            <p>
              <i className="fa-solid fa-envelope"></i> {businessEmail}
            </p>
          )}
          {whatsappNumber && (
            <p>
              <i className="fa-brands fa-whatsapp"></i>{" "}
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message us on WhatsApp
              </a>
            </p>
          )}

          <div className={styles.socialIcons}>
            {instagramLink && (
              <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </a>
            )}
            {tikTokLink && (
              <a href={tikTokLink} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            )}
            {youtubeLink && (
              <a href={youtubeLink} target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-youtube"></i>
              </a>
            )}
          </div>
        </div>

     <div className={styles.info}>
 
  <ul className={styles.otherList}>
    {/* Shipping Information */}
    <p>
      <b>Shipping:</b>{" "}
      {otherInfo?.shippingInformation
        ? otherInfo.shippingInformation
        : "We deliver to your location. Contact us for details."}
    </p>

    {/* Opening Hours */}
    <p>
      <b>Opening Hours:</b>{" "}
      {otherInfo?.openingHours
        ? otherInfo.openingHours.from === "00:00" &&
          otherInfo.openingHours.to === "00:00"
          ? "Open 24 hours"
          : `${otherInfo.openingHours.from} - ${otherInfo.openingHours.to}`
        : "open 24 hours"}
    </p>
  </ul>
</div>

      </div>

      {/* Bottom Section */}
      <div className={styles.bottomNote}>
        <p>
          &copy; {new Date().getFullYear()} {businessName}. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;