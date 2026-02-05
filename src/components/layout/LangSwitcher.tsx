"use client";

import { type Locale } from "@config";
import { Check, Globe } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import "flag-icons/css/flag-icons.min.css";
import { useLocale } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";

const LANGS: Array<{
  locale: Locale;
  label: string;
  flag: string;
  shortcut: string;
}> = [
  { locale: "ar", label: "العربية", flag: "fi-ma", shortcut: "AR" },
  { locale: "en", label: "English", flag: "fi-gb", shortcut: "EN" },
  { locale: "fr", label: "Français", flag: "fi-fr", shortcut: "FR" }
];

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, switchLanguage } = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const current = useMemo(
    () => LANGS.find((l) => l.locale === locale) ?? LANGS[0],
    [locale]
  );

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-sm text-black px-2 py-2 font-medium transition-colors lg:bg-white hover:bg-gray-400 sm:px-3"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe className={`h-6 w-6 sm:hidden ${className ?? ""}`} />
        <span className="hidden sm:inline">
          <span className={`fi ${current.flag}`} />
        </span>
        <span className="hidden font-bold uppercase tracking-wide sm:inline">
          {current.shortcut}
        </span>
      </Button>

      {open && (
        <div
          role="menu"
          className={`absolute ${dir === "rtl" ? "left-0" : "right-0"} z-50 mt-2 w-44 overflow-hidden border border-gray-200 bg-white shadow-lg sm:w-48`}
        >
          <div className="p-1">
            {LANGS.map((lang) => {
              const active = lang.locale === locale;
              return (
                <Button
                  key={lang.locale}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    switchLanguage(lang.locale);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                    active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <span className={`fi ${lang.flag} text-base sm:text-lg`} />
                    <span className={`text-sm font-medium sm:text-base ${lang.locale === "ar" ? "text-right" : ""}`}>
                      {lang.label}
                    </span>
                  </span>
                  {active && <Check className="h-4 w-4" />}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
