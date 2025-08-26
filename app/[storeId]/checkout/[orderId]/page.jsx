// app/[storeId]/checkout/[orderId]/page.jsx
import CheckoutClient from "./checkoutClient";

export async function generateMetadata({ params }) {
  const { storeId, orderId } = params;
  return {
    title: `Checkout - ${storeId} | Minimart`,
    description: `Complete your order ${orderId} securely using our checkout process.`,
    openGraph: {
      title: `Checkout - ${storeId}`,
      description: `Complete your order ${orderId} securely using our checkout process.`,
      url: `https://${storeId}.minimart.ng/checkout/${orderId}`,
    },
  };
}

export default function Page({ params }) {
  const { storeId, orderId } = params;
  return <CheckoutClient storeId={storeId} orderId={orderId} />;
}
