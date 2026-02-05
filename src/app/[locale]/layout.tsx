import "./globals.css";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { i18n, type Locale } from "@config";
import Shell from "@/components/layout/Shell";
import { getDictionary } from "@/lib/dictionaries";

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

export const generateStaticParams = async () => {
  return i18n.locales.map((locale) => ({ locale }));
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // ✅ Changed to Promise
};

function isLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}

export default async function RootLayout({ children, params }: LayoutProps) {
  // ✅ Await params
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : i18n.defaultLocale;

  const dictionary = await getDictionary(locale);
  const dir = i18n.dir(locale);

  return (
    <html lang={locale} dir={dir}>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <Shell locale={locale} dictionary={dictionary}>
          {children}
        </Shell>
      </body>
    </html>
  );
}
