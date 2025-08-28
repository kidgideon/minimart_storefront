"use client";
import { useEffect } from "react";

const FooterAd = () => {
  useEffect(() => {
    const container = document.getElementById("footer-ad");
    if (!container) return;

    // Script with ad options
    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key' : 'eb4a0c929da4e79c21ea23e9c20e001f',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    // Script to load the ad
    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = "//www.highperformanceformat.com/eb4a0c929da4e79c21ea23e9c20e001f/invoke.js";

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
        justifyContent: "center"
      }}
    >
      <div id="footer-ad"></div>
    </div>
  );
};

export default FooterAd;
