import type { Locale } from "@config";
import { i18n } from "@config";

function isLocaleSegment(value: string) {
  return (i18n.locales as readonly string[]).includes(value);
}

export function withLocalePath(pathname: string, locale: Locale) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length > 0 && isLocaleSegment(parts[0])) {
    parts[0] = locale;
  } else {
    parts.unshift(locale);
  }

  return `/${parts.join("/")}`;
}
