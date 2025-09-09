import Image from "next/image";
import styles from "./features.module.css";

import customization from "../../public/images/customization.svg";
import payment from "../../public/images/payment.svg";
import products from "../../public/images/products.svg";
import analytics from "../../public/images/analytics.svg";
import mobile from "../../public/images/mobile.svg";
import secure from "../../public/images/secure.svg";

export default function Features() {
  const features = [
    {
      img: customization,
      title: "Custom Branding",
      text: "Design your Minimart storefront with your own colors, logo, and promotional banners."
    },
    {
      img: payment,
      title: "Instant Payments",
      text: "Receive secure payments instantly with branded digital receipts for your customers."
    },
    {
      img: products,
      title: "Products & Services",
      text: "Sell both physical products and services in one seamless Minimart storefront."
    },
    {
      img: analytics,
      title: "Analytics Dashboard",
      text: "Track store views, customer engagement, and sales to grow smarter."
    },
    {
      img: mobile,
      title: "Mobile Ready",
      text: "Optimized for smartphones, tablets, and desktops for maximum reach."
    },
    {
      img: secure,
      title: "Secure Platform",
      text: "Enterprise-grade security keeps your data and your customers safe."
    }
  ];

  return (
    <section
      className={styles.featuresSection}
      aria-label="Key features of Minimart"
    >
      <h2 className={styles.featuresTitle}>
        Powerful Features to <span className={styles.coloredArea}>Grow Your Business with Minimart</span>
      </h2>

      <ul className={styles.featuresContainer}>
        {features.map((f, index) => (
          <li
            key={index}
            className={`${styles.featureCard} fade-in`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <Image
              src={f.img}
              alt={`${f.title} feature in Minimart`}
              className={styles.featureIcon}
              width={64}
              height={64}
            />
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureText}>{f.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
