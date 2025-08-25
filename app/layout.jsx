// app/[storeId]/layout.jsx
import StoreColorProvider from "../components/storeColorProvider/colorProvider";
import "../globals.css";

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
        {/* Client component will fetch and inject colors */}
        <StoreColorProvider storeId={storeId} />
        {children}
      </body>
    </html>
  );
}
