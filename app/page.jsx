// app/page.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Head from "next/head";

import Navbar from "../components/homeNav/navbar";
import Hero from "../components/hero/hero";
import Evaluations from "../components/evaluations/evaluation";
import Features from "../components/Featured/Featured";
import HowItWorks from "../components/work/work";
import Comments from "../components/comment/comment";
import CallToAction from "../components/cta/cta";
import Footer from "../components/homeFooter/footer";

export default async function StoreLanding() {
  // Read cookies on server
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || null;

  // If logged in → redirect to dashboard
  if (token) {
    redirect("https://www.minimart.ng/dashboard");
  }

  return (
    <>
      <Head>
        <title>Minimart – Your Online Storefront Solution</title>
        <meta
          name="description"
          content="Minimart lets you create an online storefront in minutes. Sell products, manage orders, and grow your business online effortlessly."
        />
        <meta
          name="keywords"
          content="minimart, online store Nigeria, ecommerce builder, free storefront, online business tools"
        />
        <meta property="og:title" content="Minimart – Create Your Storefront" />
        <meta
          property="og:description"
          content="Set up your online store with Minimart today. Free, easy to use, and designed to grow your business."
        />
        <meta property="og:url" content="https://store.minimart.ng" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://minimart.ng/og-image.jpg" />
        <link rel="canonical" href="https://store.minimart.ng" />
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
