import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { JsonLd, organizationSchema } from "@/lib/seo";
import { companyName, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Pendik'te Yeni Nesil Yaşam Projesi`,
    template: `%s | ${siteName}`,
  },
  description:
    "Elys Prime, Pendik'te 35.000 m² inşaat alanı, 4 blok ve 192 daireden oluşan yeni nesil bir yaşam projesi. Daire planları, güncel proje durumu ve ulaşım bilgileri.",
  applicationName: siteName,
  authors: [{ name: companyName }],
  creator: companyName,
  publisher: companyName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName,
    title: `${siteName} | Pendik'te Yeni Nesil Yaşam Projesi`,
    description:
      "Pendik'te 4 blok, 192 daire. Daire planlarını, proje durumunu ve konumu inceleyin.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Pendik'te Yeni Nesil Yaşam Projesi`,
    description: "Pendik'te 4 blok, 192 daire. Daire planlarını ve proje durumunu inceleyin.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#181a18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <JsonLd schema={organizationSchema()} />
      </body>
    </html>
  );
}
