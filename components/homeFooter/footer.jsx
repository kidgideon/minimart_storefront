// components/footer/Footer.js
import Image from "next/image";
import styles from "./footer.module.css";
import logo from "../../public/images/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.topSection}>
        {/* Company Info */}
        <div className={styles.companyInfo}>
          <div className={styles.logoArea}>
            <Image
              src={logo}
              alt="Minimart Logo - Build Your Online Storefront"
              className={styles.logo}
              width={120}
              height={40}
              priority
            />
            <h2>Minimart</h2>
          </div>
          <p>
            Minimart helps businesses in Nigeria create online storefronts,
            showcase products, manage orders, and receive secure payments with ease.
          </p>
          <div className={styles.contactInfo}>
            <p>
              <i className="fa-solid fa-map-pin"></i> Yenagoa, Bayelsa State, Nigeria
            </p>
            <p>
              <i className="fa-solid fa-phone"></i> +234 704 657 8294
            </p>
            <p>
              <i className="fa-solid fa-envelope"></i> minimart.com.ng@gmail.com
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.linkGroup}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/signup">Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Services */}
        <div className={styles.linkGroup}>
          <h4>Our Services</h4>
          <ul>
            <li><a href="/signup">Create Store</a></li>
            <li><a href="/signup">Manage Products</a></li>
            <li><a href="/signup">Sales Analytics</a></li>
            <li><a href="/signup">24/7 Support</a></li>
          </ul>
        </div>

        {/* Newsletter / Social */}
        <div className={styles.newsletter}>
          <h4 style={{ margin: "20px 0" }}>Stay Updated</h4>
          <p>Subscribe to receive updates, discounts, and e-commerce tips.</p>
          <div className={styles.subscribe}>
            <input type="email" placeholder="Enter your email" />
            <button aria-label="Subscribe to newsletter">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomSection}>
        <p>© {currentYear} Minimart. All rights reserved.</p>
        <div className={styles.legalLinks}>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cookies">Cookie Policy</a>
        </div>
      </div>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Minimart",
            url: "https://www.minimart.ng",
            logo: "https://store.minimart.ng/images/logo.png",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+2347046578294",
              contactType: "customer support",
              areaServed: "NG",
              availableLanguage: "English"
            },
            sameAs: [
              "https://facebook.com",
              "https://twitter.com",
              "https://instagram.com",
              "https://linkedin.com"
            ]
          })
        }}
      />
    </footer>
  );
};

export default Footer;
