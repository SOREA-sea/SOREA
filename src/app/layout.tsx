import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOREA - Votre bulle de sérénité",
  description: "SOREA propose des rituels, des produits et des accompagnements pour mieux vivre chaque jour. Découvrez nos kits bien-être et nos coachings sur-mesure pour une expérience digitale apaisante.",
  keywords: ["bien-être", "coaching", "sérénité", "kits sensoriels", "développement personnel", "santé mentale", "SOREA"],
  authors: [
    { name: "Benladamm" },
    { name: "Enzo_dscp" },
    { name: "sxnki" },
  ],
  creator: "Benladamm, Enzo_dscp & sxnki",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "SOREA",
    title: "SOREA - Votre bulle de sérénité",
    description: "Des rituels, des produits et des accompagnements pour apaiser le corps et l'esprit.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOREA - Votre bulle de sérénité",
    description: "Des rituels, des produits et des accompagnements pour apaiser le corps et l'esprit.",
  },
  icons: {
    icon: "/images/logo_sorea.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
