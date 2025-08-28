"use client";
import { useEffect } from "react";

const FooterAd = () => {
  useEffect(() => {
    const container = document.getElementById("footer-ad");
    if (!container) return;

    // Script with ad options (updated)
    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key' : 'f07020e3bdae136b043dbec62cea641f',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    // Script to load the ad (updated)
    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = "//www.highperformanceformat.com/f07020e3bdae136b043dbec62cea641f/invoke.js";

    // Append both to the container instead of body
    container.appendChild(script1);
    container.appendChild(script2);

    return () => {
      container.innerHTML = ""; // Clean up when component unmounts
    };
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        margin: "20px 0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div id="footer-ad" style={{ width: "320px", height: "50px" }}></div>
    </div>
  );
};

export default FooterAd;
