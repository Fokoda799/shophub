"use client";

import Link from 'next/link';
import { useLanguage, useLocalizedPath } from "@/context/LanguageContext";

const Footer = () => {
  const dict = useLanguage("footer");
  const localize = useLocalizedPath();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-black uppercase tracking-tight md:text-2xl">
              {dict.brand.name}
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              {dict.brand.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
              {dict.sections.shop}
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href={localize("/shop")} className="transition-colors hover:text-white">
                  {dict.links.all_bags}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
              {dict.sections.support}
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href={localize("/contact")} className="transition-colors hover:text-white">
                  {dict.links.contact_us}
                </Link>
              </li>
              <li>
                <Link href={localize("/shipping")} className="transition-colors hover:text-white">
                  {dict.links.shipping_info}
                </Link>
              </li>
              <li>
                <Link href={localize("/returns")} className="transition-colors hover:text-white">
                  {dict.links.returns_exchanges}
                </Link>
              </li>
              <li>
                <Link href={localize("/faq")} className="transition-colors hover:text-white">
                  {dict.links.faq}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
              {dict.sections.follow_us}
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {dict.social.instagram}
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {dict.social.facebook}
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {dict.social.pinterest}
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {dict.social.tiktok}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 md:mt-12">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-xs text-gray-500 md:text-sm">
              {dict.footer.copyright.replace("{year}", String(new Date().getFullYear()))}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 md:gap-6 md:text-sm">
              <Link href={localize("/privacy")} className="transition-colors hover:text-white">
                {dict.links.privacy_policy}
              </Link>
              <Link href={localize("/terms")} className="transition-colors hover:text-white">
                {dict.links.terms_of_service}
              </Link>
              <Link href={localize("/cookies")} className="transition-colors hover:text-white">
                {dict.links.cookie_policy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;