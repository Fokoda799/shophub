"use client";

import { type Locale } from "@config";
import Header from "./Header";
import Footer from "./Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import type { Dictionary } from "@/types/local";

export default function Shell({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode;
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <LanguageProvider initialLocale={locale} initialDictionary={dictionary}>
      <Header />
      {children}
      <Footer />
    </LanguageProvider>
  );
}
