// app/[storeId]/layout.jsx
import StoreColorProvider from "../components/storeColorProvider/colorProvider";
import "../globals.css";
import { Toaster } from "sonner"; // Add this import

export default function StoreLayout({ children, params }) {
  const { storeId } = params;

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {/* Inject store-specific colors */}
        <StoreColorProvider storeId={storeId} />

        {/* Global Toaster (top-right) */}
        <Toaster position="top-right" richColors />

        {children}
      </body>
    </html>
  );
}
