import "./globals.scss";
import { Oswald } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";

const oswald = Oswald({
  variable: "--font-oswald", 
  subsets: ["latin", "cyrillic"],
  weight: "600",
});

export const metadata = {
  title: "Отель Маьт Лоам в Горной Ингушетии - Отдых у подножия гор",
  description: "Отель Маьт Лоам в Горной Ингушетии. Уединенный отдых, панорамные виды, современный комфорт. Идеально для ценителей природы и культуры Кавказа. Забронируйте сейчас.",
  keywords: "отель в ингушетии, отдых в ингушетии, отдых в горах ингушетии, гостиница в ингушетии, отель Маьт Лоам, гостиница Маьт Лоам, отель в Джейрахском районе, отель в селе Арамхи, гостиница в селе Арамхи, забронировать отель в Ингушетии, бронирование гостиницы в горах",
  openGraph: {
    title: "Отель Маьт Лоам в Горной Ингушетии - Отдых у подножия гор",
    description: "Уединенный отдых, панорамные виды, современный комфорт. Идеально для ценителей природы и культуры Кавказа",
    url: "https://mattloam.ru",
    siteName: "Отель Маьт Лоам",
    images: [
      {
        url: "https://www.mattloam.ru/assets/images/mainImage.jpeg",
        width: 1648,
        height: 928,
        alt: "Отель Маьт Лоам - панорамный вид на горы Ингушетии",
      },
    ],
    locale: "ru_RU",
    type: "website",
    tags: [ "отель", "отдых", "горы", "Ингушетия", "Кавказ", "туризм", "Джейрах", "джейрахское ущелье" ]
  },
  category: "travel",
  icons: {
    icon: [
      { url: "/assets/favicon/favicon.ico", sizes: "any" },
      { url: "/assets/favicon/icon1.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/favicon/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/assets/favicon/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/assets/favicon/favicon.ico" }],
  },
  manifest: "/assets/favicon/manifest.json",
  appleWebApp: {
    title: "Maьт Лоам",
    statusBarStyle: "black-translucent"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    },
  },
  verification: {
    google: "rNWsL6RE1Yl80ZauoiHLbXN1Q-AwnqQCoMFh3c7neqw",
    yandex: "16ebdaca93c6135b"
  },
  alternates: {
    canonical: "https://mattloam.ru"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a2b5c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <Script
          id="schema-org-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              "name": "Отель Маьт Лоам в Горной Ингушетии - Отдых у подножия гор",
              "description": "Отель Маьт Лоам в Горной Ингушетии. Уединенный отдых, панорамные виды, современный комфорт. Идеально для ценителей природы и культуры Кавказа. Забронируйте сейчас.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "улица Льянова, 52",
                "addressLocality": "Джейрах",
                "addressRegion": "Ингушетия",
                "addressCountry": "Россия"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 42.8235,
                "longitude": 44.6819
              },
              "telephone": [
                "+7-963-172-66-22",
                "+7-918-812-56-52"
              ],
              "url": "https://mattloam.ru",
              "priceRange": "₽₽",
              "starRating": {
                "@type": "Rating",
                "ratingValue": "4"
              },
              "amenityFeature": [
                { "@type": "LocationFeatureSpecification", "name": "Телевизор" },
                { "@type": "LocationFeatureSpecification", "name": "Wi-Fi" },
                { "@type": "LocationFeatureSpecification", "name": "Холодильник" },
                { "@type": "LocationFeatureSpecification", "name": "Стиральная машина" },
                { "@type": "LocationFeatureSpecification", "name": "Кухня" },
                { "@type": "LocationFeatureSpecification", "name": "Душ" },
                { "@type": "LocationFeatureSpecification", "name": "Кондиционер" }
              ]
            })
          }}
        />
      </head>
      <body className={ oswald.variable }>
        <Toaster position="top-center" richColors />
        { children }
      </body>
    </html>
  );
}
