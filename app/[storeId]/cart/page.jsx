import CartClient from "./cartClient";

export async function generateMetadata({ params }) {
  const storeId = params.storeId;
  return {
    title: `Cart - ${storeId} | Minimart`,
    description: "View your shopping cart and checkout seamlessly.",
    openGraph: {
      title: `Cart - ${storeId}`,
      description: "View your shopping cart and checkout seamlessly.",
      url: `https://${storeId}.minimart.ng/cart`,
    },
  };
}

export default function Page({ params }) {
  return <CartClient storeId={params.storeId} />;
}
