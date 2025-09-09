import Link from "next/link";
import Image from "next/image";
import styles from "./navbar.module.css";
import Logo from "../../public/images/logo.png";

export default function Navbar() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/signup", label: "Join Now" },
    { href: "/signin", label: "Login" },
    { href: "/about", label: "About" }
  ];

  return (
    <header className={styles.navbarInterface}>
      <nav className={styles.navbar} aria-label="Primary navigation">
        <div className={styles.companyArea}>
          <Link href="/" aria-label="Minimart Home">
            <Image
              src={Logo}
              alt="Minimart Logo - Nigerian Online Store Builder"
              width={140}
              height={45}
              priority
            />
          </Link>
          <p className={styles.brandName}>
            Mini<span>mart</span>
          </p>
        </div>

        {/* Desktop Nav */}
        <ul className={styles.hamburgerArea}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Icon */}
        <button
          id="mobile-toggle"
          className={styles.mobileIcon}
          aria-label="Open mobile menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <div id="mobile-panel" className={styles.panel}>
        <div className={styles.overlay}></div>
        <div className={styles.mobileMenu}>
          <ul>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* JSON-LD for Site Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SiteNavigationElement",
            name: navLinks.map((l) => l.label),
            url: navLinks.map((l) => `https://store.minimart.ng${l.href}`)
          })
        }}
      />

      {/* Mobile Menu Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function () {
              const toggle = document.getElementById('mobile-toggle');
              const panel = document.getElementById('mobile-panel');
              const overlay = panel.querySelector('.${styles.overlay}');
              
              toggle.addEventListener('click', () => {
                panel.classList.toggle('${styles.show}');
              });
              
              overlay.addEventListener('click', () => {
                panel.classList.remove('${styles.show}');
              });
            });
          `
        }}
      />
    </header>
  );
}
