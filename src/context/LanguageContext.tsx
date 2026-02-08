"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@config";
import type { Dictionary, DictionaryKey } from "@/types/local";
import { withLocalePath } from "@/features/i18n/routing";

type LanguageContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  switchLanguage: (newLocale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLocale,
  initialDictionary,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
  initialDictionary: Dictionary;
}) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const switchLanguage = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return;
      setLocale(newLocale);
      router.push(withLocalePath(pathname, newLocale));
    },
    [locale, pathname, router]
  );

  const value = useMemo(
    () => ({
      locale,
      dictionary: initialDictionary,
      switchLanguage,
    }),
    [initialDictionary, locale, switchLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLocale() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLocale must be used inside LanguageProvider");
  }
  return { locale: context.locale, switchLanguage: context.switchLanguage };
}

export function useLanguage<K extends DictionaryKey>(section: K): Dictionary[K] {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context.dictionary[section];
}

export function useLocalizedPath() {
  const { locale } = useLocale();
  return useCallback((path: string) => withLocalePath(path, locale), [locale]);
}
