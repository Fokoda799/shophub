"use client";

import Link from 'next/link';
import { useLanguage, useLocalizedPath } from "@/context/LanguageContext";

const Footer = () => {
  const dict = useLanguage("footer");
  const localize = useLocalizedPath();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
          <div>
            <h3 className="mb-6 text-2xl font-black uppercase tracking-tight">
              {dict.brand.name}
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              {dict.brand.description}
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest">{dict.sections.shop}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href={localize("/shop")} className="transition-colors hover:text-white">
                  {dict.links.all_bags}
                </Link>
              </li>
              {/* <li>
                <Link href={localize("/new-arrivals")} className="transition-colors hover:text-white">
                  {dict.links.new_arrivals}
                </Link>
              </li>
              <li>
                <Link href={localize("/bestsellers")} className="transition-colors hover:text-white">
                  {dict.links.bestsellers}
                </Link>
              </li>
              <li>
                <Link href={localize("/sale")} className="transition-colors hover:text-white">
                  {dict.links.sale}
                </Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest">{dict.sections.support}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
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
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest">{dict.sections.follow_us}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
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

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              {dict.footer.copyright.replace("{year}", String(new Date().getFullYear()))}
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
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
