"use client";

import { usePathname } from "next/navigation";
import Headers from "./Header";
import Footer from "./Footer";

export default function Shell({ children, dict }: { children: React.ReactNode; dict: any }) {
  const pathname = usePathname();
  // If you have locale routes like /en, /fr, /ar, we should allow:
  // "/"         (rare in [locale] setup)
  // "/en"       landing
  // "/en/shop"  shop
  // same for fr/ar
  const parts = pathname.split("/").filter(Boolean); // e.g. ["en","shop"]
  const maybeLocale = parts[0];
  const afterLocale = parts.slice(1).join("/"); // "shop", "product/...", "admin"

  const isLanding = parts.length === 1; // "/en"
  const isShop = afterLocale === "shop"; // "/en/shop"

  const allow = isLanding || isShop;

  return (
    <>
      <Headers locale={maybeLocale as 'en' | 'fr' | 'ar'} dict={dict.header} />
       {children}
      <Footer dict={dict.footer} />
    </>
  );
}
