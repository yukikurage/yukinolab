import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans_JP,
  Lexend_Exa,
  Shadows_Into_Light_Two,
} from "next/font/google";
import "./globals.css";
import MouseEffect from "@/components/MouseEffect";
import CircularBackground from "@/components/CircularBackground";
import BackgroundStars from "@/components/BackgroundStars";
import PageBackground from "@/components/PageBackground";
import ScrollCircle from "@/components/ScrollCircle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lexendExa = Lexend_Exa({
  variable: "--font-lexend-exa",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700"],
});

const shadowsIntoLightTwo = Shadows_Into_Light_Two({
  variable: "--font-shadows-into-light-two",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "YUKINOLABO",
  description: "ホームページ制作",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
  openGraph: {
    title: "YUKINOLABO",
    description: "ホームページ制作",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "YUKINOLABO",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "YUKINOLABO - ホームページ制作",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YUKINOLABO",
    description: "ホームページ制作",
    images: ["/ogp.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${lexendExa.variable} ${shadowsIntoLightTwo.variable} antialiased`}
      >
        <PageBackground />
        <CircularBackground />
        <ScrollCircle />
        <BackgroundStars />
        <MouseEffect />
        {children}
      </body>
    </html>
  );
}
