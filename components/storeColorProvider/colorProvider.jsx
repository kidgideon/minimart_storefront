// components/StoreColorProvider.jsx
"use client";

import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function StoreColorProvider({ storeId }) {
  useEffect(() => {
    async function fetchColors() {
      if (!storeId) return;

      try {
        const bizRef = doc(db, "businesses", storeId);
        const bizSnap = await getDoc(bizRef);

        if (bizSnap.exists()) {
          const data = bizSnap.data();
          const primary = data?.customTheme?.primaryColor || "#1C2230";
          const secondary = data?.customTheme?.secondaryColor || "#43B5F4";

          document.documentElement.style.setProperty("--storePrimary", primary);
          document.documentElement.style.setProperty("--storeSecondary", secondary);
          console.log("added")
        }
      } catch (error) {
        console.error("Failed to fetch store colors:", error);
      }
    }

    fetchColors();
  }, [storeId]);

  return null; // It just injects colors, no UI
}
