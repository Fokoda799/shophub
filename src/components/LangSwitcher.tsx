"use client";

import { usePathname, useRouter } from "next/navigation";
import { type Locale } from "../../i18n.config";
import { GlobeIcon, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import "flag-icons/css/flag-icons.min.css";

const LANGS: Array<{
  locale: Locale;
  label: string;
  flag: string;
  shortcut: string;
}> = [
  { locale: "ar", label: "العربية", flag: "fi-ma", shortcut: "AR" },
  { locale: "en", label: "English", flag: "fi-sh", shortcut: "EN" },
  { locale: "fr", label: "Français", flag: "fi-fr", shortcut: "FR" }
];

function replaceLocaleInPath(pathname: string, newLocale: Locale) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length > 0 && (parts[0] === "en" || parts[0] === "fr" || parts[0] === "ar")) {
    parts[0] = newLocale;
  } else {
    parts.unshift(newLocale);
  }

  return "/" + parts.join("/");
}

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: Locale;
}) {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const current = useMemo(
    () => LANGS.find((l) => l.locale === currentLocale) ?? LANGS[0],
    [currentLocale]
  );

  function changeLanguage(newLocale: Locale) {
    if (newLocale === currentLocale) return;
    const newPath = replaceLocaleInPath(pathname, newLocale);
    router.push(newPath);
    setOpen(false);
  }

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
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-colors hover:border-gray-900 hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="hidden sm:inline"><span className={`fi ${current.flag}`} ></span></span>
        <span className="hidden font-bold uppercase tracking-wide sm:inline">{current.shortcut}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 overflow-hidden border border-gray-200 bg-white shadow-lg"
        >
          <div className="p-1">
            {LANGS.map((lang) => {
              const active = lang.locale === currentLocale;
              return (
                <button
                  key={lang.locale}
                  type="button"
                  role="menuitem"
                  onClick={() => changeLanguage(lang.locale)}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                    active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`fi ${lang.flag}`} ></span>
                    <span className={`font-medium ${lang.locale === "ar" ? "text-right" : ""}`}>
                      {lang.label}
                    </span>
                  </span>
                  {active && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}