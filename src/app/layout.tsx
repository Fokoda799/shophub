"use client";

import "./globals.css";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { usePathname } from "next/navigation";
import Headers from "../components/Header";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // show header only on landing + shop
  const allow = pathname === "/" || pathname === "/shop";

  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        {allow && <Headers />}
        {children}
      </body>
    </html>
  );
}
