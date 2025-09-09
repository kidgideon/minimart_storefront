// app/page.jsx
import Head from "next/head";

import Navbar from "../components/homeNav/navbar";
import Hero from "../components/hero/hero";
import Evaluations from "../components/evaluations/evaluation";
import Features from "../components/features/features";
import HowItWorks from "../components/work/work";
import Comments from "../components/comment/comment";
import CallToAction from "../components/cta/cta";
import Footer from "../components/homeFooter/footer";

export default async function StoreLanding() {
  const siteUrl = "https://store.minimart.ng";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Minimart",
    url: siteUrl,
    logo: "https://minimart.ng/logo.png",
    sameAs: [
      "https://www.facebook.com/minimart",
      "https://www.instagram.com/minimart",
      "https://twitter.com/minimart"
    ],
    description:
      "Minimart is Nigeria’s easiest online store builder – create your free storefront, sell products, and manage orders effortlessly.",
  };

  return (
    <>
      <Head>
        <title>
          Minimart – Build Your Online Store in Minutes | Free Storefront in
          Nigeria
        </title>
        <meta
          name="description"
          content="Create your online storefront with Minimart. Sell products, manage orders, and grow your business online effortlessly – 100% free to start."
        />
        <meta
          name="keywords"
          content="minimart, online store Nigeria, ecommerce builder, free storefront, start selling online, ecommerce platform Nigeria"
        />
        <meta property="og:title" content="Minimart – Create Your Free Storefront" />
        <meta
          property="og:description"
          content="Start selling online today with Minimart. Simple, free, and powerful ecommerce tools for businesses in Nigeria."
        />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://minimart.ng/og-image.jpg" />
        <link rel="canonical" href={siteUrl} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* JivoChat Widget */}
        <script
          src="//code.jivosite.com/widget/dqVBJTG81b"
          async
        ></script>
      </Head>

      <main>
        <Navbar />
        <Hero />
        <Evaluations />
        <Features />
        <HowItWorks />
        <Comments />
        <CallToAction />
        <Footer />
      </main>
    </>
  );
}
