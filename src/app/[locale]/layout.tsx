import "./globals.css";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { i18n, Locale } from "../../../i18n.config";
import Shell from "../../components/Shell";
import { getDictionary } from 'components/lib/dictionaries';

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await Promise.resolve(params);
  const dict = await getDictionary(locale);
  const dir = i18n.dir(locale);

  return (
    <html lang={locale} dir={dir}>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <Shell dict={dict}>{children}</Shell>
      </body>
    </html>
  );
}
