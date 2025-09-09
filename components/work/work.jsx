import Image from "next/image";
import styles from "./work.module.css";

import signup from "../../public/images/signup.svg";
import list from "../../public/images/list.svg";
import order from "../../public/images/order.svg";
import shopper from "../../public/images/shoppers.svg";

export default function HowItWorks() {
  const steps = [
    { img: signup, title: "Sign Up", text: "Create your free Minimart account in less than a minute." },
    { img: list, title: "Add Products & Services", text: "Upload items, set prices, and organize your storefront." },
    { img: order, title: "Enable Secure Payments", text: "Connect your bank to start receiving instant payments." },
    { img: shopper, title: "Share & Start Selling", text: "Promote your store link across WhatsApp, Instagram, and other platforms." }
  ];

  return (
    <section className={styles.worksSection}>
      <h2 className={styles.worksTitle}>
        How Minimart Helps You <span className={styles.highlight}>Sell Online</span>
      </h2>

      <ol className={styles.worksContainer}>
        {steps.map((s, index) => (
          <li key={index} className={styles.stepCard}>
            <Image
              src={s.img}
              alt={`${s.title} - ${s.text}`}
              className={styles.stepIcon}
              width={80}
              height={80}
              priority={index === 0}
            />
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepText}>{s.text}</p>
          </li>
        ))}
      </ol>

      {/* Structured Data for How-To Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Sell Online with Minimart",
            description: "Step-by-step guide to create a free online store in Nigeria using Minimart.",
            step: steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.text
            }))
          })
        }}
      />
    </section>
  );
}
