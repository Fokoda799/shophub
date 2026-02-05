"use client";

import Link from "next/link";
import ImageGalleryZoom from "@/components/product/ImageGalleryZoom";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Button from "@/components/ui/Button";
import type { ProductDoc } from "@/lib/products";
import { useLanguage, useLocale } from "@/context/LanguageContext";
import ShareModal from "./ShareModal";
import { useState } from "react";
import { urlFormat } from "@/lib/url-format";

export default function ProductDetailsContent({
  product,
  imageUrls,
}: {
  product: ProductDoc;
  imageUrls: string[];
}) {
  const { locale } = useLocale();
  const t = useLanguage("product").product;
  const [openShareModal, setOpenShareModal] = useState(false);
  const url = typeof window === "undefined" ? "" : urlFormat(window.location.href);

  return (
    <main className="min-h-screen bg-white pt-10">
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-12">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-600 transition-colors hover:text-gray-900 md:mb-8"
          href={`/${locale}`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.back}
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="bg-gray-50 p-4 md:p-6">
            <ImageGalleryZoom imageUrls={imageUrls} alt={product.title} />
          </div>

          <div className="flex flex-col">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
              <Link href={`/${locale}`} className="transition-colors hover:text-gray-900">
                {t.home}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/shop`} className="transition-colors hover:text-gray-900">
                {t.shop}
              </Link>
            </div>

            <h1 className="mb-4 text-3xl font-black uppercase leading-tight tracking-tight text-gray-900 md:mb-6 md:text-4xl lg:text-5xl">
              {product.title}
            </h1>

            <div className="mb-6 border-b border-gray-200 pb-6 md:mb-8 md:pb-8">
              <div className="mb-1 text-2xl font-black text-gray-900 md:text-3xl">
                {product.price.toFixed(2)} {t.currency}
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-900 md:mb-4 md:text-sm">
                {t.description}
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                {product.description}
              </p>
            </div>

            <div className="mb-6 space-y-2 border-y border-gray-200 py-6 md:mb-8 md:space-y-3 md:py-8">
              {t.features?.map(
                (feature: { icon: string; text: string }, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="h-4 w-4 shrink-0 text-gray-900 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </div>
                )
              )}
            </div>

            <div className="lg:relative space-y-3 md:space-y-4 fixed bottom-0 left-0 right-0 z-20 w-full bg-white p-4 shadow-t md:static md:bg-transparent md:p-0 md:shadow-none lg:px-0 lg:pt-0">
              <AddToCartButton product={product} />

              <div className="grid grid-cols-1 gap-3">
                <Button className="hidden items-center justify-center gap-2 border border-gray-300 py-3 text-xs font-bold uppercase tracking-wide transition-colors hover:border-gray-900 hover:bg-gray-50 md:text-sm">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="hidden sm:inline">{t.favorite}</span>
                  <span className="sm:hidden">{t.save}</span>
                </Button>

                <Button 
                  onClick={() => setOpenShareModal(true)}
                  className="flex items-center justify-center gap-2 border border-gray-300 py-3 text-xs font-bold uppercase tracking-wide transition-colors hover:border-gray-900 hover:bg-gray-50 md:text-sm">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {t.share}
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-200 pt-8 md:mt-12 md:gap-6">
              {t.guarantees?.map(
                (guarantee: { icon: string; label: string }, index: number) => (
                  <div key={index} className="text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 md:h-12 md:w-12">
                      <svg className="h-5 w-5 text-gray-900 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={guarantee.icon} />
                      </svg>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-gray-700 md:text-xs">
                      {guarantee.label}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <ShareModal open={openShareModal} onClose={() => setOpenShareModal(false)} url={url} />
    </main>
  );
}
