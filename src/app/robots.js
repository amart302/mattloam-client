export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: "https://mattloam.ru/sitemap.xml",
  };
}