import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";

// Static images (no React state)
import shoppingOne from "../../public/images/shopping.svg";
import shoppingTwo from "../../public/images/onlineshop.svg";
import shoppingThree from "../../public/images/cart.svg";

export default function Hero() {
  const images = [
    { src: shoppingOne, alt: "Create your online store with Minimart" },
    { src: shoppingTwo, alt: "Sell products and services online using Minimart" },
    { src: shoppingThree, alt: "Receive payments and manage orders on Minimart" }
  ];

  return (
    <header className={styles.heroSection}>
      <div className={styles.textSection}>
        <h1>Minimart – Create Your Online Storefront in Minutes</h1>
        <p>
          Build a professional online presence for your business. List your products or
          services, accept secure payments, and manage everything with ease — all in one
          platform.
        </p>
        <Link href="/signup" className={styles.ctaBtn}>
          Create Your Storefront
        </Link>
      </div>

      <div className={`${styles.imageArea} hero-carousel`}>
        {images.map((img, index) => (
          <Image
            key={index}
            src={img.src}
            alt={img.alt}
            width={400}
            height={400}
            priority={index === 0}
            className="carousel-image"
            style={{ animationDelay: `${index * 4}s` }}
          />
        ))}
      </div>
    </header>
  );
}
