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
  title: "Trenpick - TikTok Shop バズ初動通知ツール",
  description:
    "TikTok Shopでバズり始めた商品を自動検知し、Discordに即時通知。競合より早く動画を作れる、クリエイターのためのバズ初動キャッチツール。",
  keywords: [
    "TikTok Shop",
    "バズ通知",
    "トレンド分析",
    "TikTokアフィリエイター",
    "物販",
    "ガジェット",
  ],
  openGraph: {
    title: "Trenpick - TikTok Shop バズ初動通知ツール",
    description:
      "商品がバズり始めたその瞬間をつかみ、競合より早く動画を作れる。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
