import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import LayoutPortal from "@/layout/LayoutPortal";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "EmpaPortal V2",
  description: "EmpaTools Next.js Version",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJp.variable} font-sans bg-background-subtle`}
        suppressHydrationWarning={true}
      >
        <LayoutPortal>{children}</LayoutPortal>
      </body>
    </html>
  );
}
