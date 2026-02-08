"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductDoc } from "@/types/product";
import { getPublicAppwriteImageUrl } from "@/lib/appwrite/client";
import { useEffect, useState } from "react";
import { useLanguage, useLocalizedPath } from "@/context/LanguageContext";
import AddToCartButton from "../cart/AddToCartButton";

export default function ProductCard({ product }: { product: ProductDoc }) {
  const copy = useLanguage("product_card");
  const localize = useLocalizedPath();

  const coverId = product.imageFileIds?.[0];
  const coverUrl = coverId ? getPublicAppwriteImageUrl(coverId) : null;
  const coverSrc =
    typeof coverUrl === "string" && coverUrl.startsWith("http")
      ? coverUrl
      : null;

  const [seenFlag, setSeenFlag] = useState(false);


  const markAsSeen = () => {
    localStorage.setItem(
      `seen_product_${product.$id}`,
      Date.now().toString()
    );
    setSeenFlag(true);
  };

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setSeenFlag(
        localStorage.getItem(`seen_product_${product.$id}`) !== null
      );
    });
    return () => window.cancelAnimationFrame(id);
  }, [product.$id]);

  return (
    <Link
      href={localize(`/product/${product.$id}`)}
      onClick={markAsSeen}
      className="group block"
    >
      <article className="overflow-hidden bg-white transition-all duration-300 hover:shadow-xl">
        {/* IMAGE */}
        <div className="relative aspect-[3/4] overflow-hidden bg-white  ">
          {coverSrc ? (
            <>
              <Image
                src={coverSrc}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-gray-300">
              <svg
                className="mb-2 h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wide">
                {copy.no_image}
              </span>
            </div>
          )}

          {/* SEEN BADGE */}
          {seenFlag && (
            <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
              <div className="rounded bg-gray-900/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur sm:text-xs">
                {copy.viewed}
              </div>
            </div>
          )}

          {/* DESKTOP ADD TO CART - Slide up on hover */}
          <div className="absolute bottom-0 left-0 right-0 hidden translate-y-full bg-white p-4 transition-transform duration-300 group-hover:translate-y-0 md:block">
            <AddToCartButton product={product} />
          </div>
        </div>
                    

        {/* CONTENT */}
        <div className="p-3 sm:p-4 relative">
          <h3 className="mb-2 line-clamp-2 text-sm font-bold uppercase tracking-wide text-gray-900">
            {product.title}
          </h3>

          <div className="flex flex-row justify-between">
            {product.description && (
              <p className="mb-3 line-clamp-2 text-xs text-gray-600">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-1 text-gray-500 bg-linear-to-br from-rose-100 to-amber-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest ring-1 ring-black/5">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 7h11v8H3z" />
                <path d="M14 10h4l3 3v2h-7z" />
                <circle cx="7" cy="17" r="1.5" fill="currentColor" />
                <circle cx="17" cy="17" r="1.5" fill="currentColor" />
              </svg>
              {copy.free_shipping}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-base font-black text-gray-900 sm:text-lg">
              {product.price.toFixed(2)} {copy.currency}
            </div>

            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-3 w-3 fill-current text-amber-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="ml-1 text-xs text-gray-500">
                {copy.rating}
              </span>
            </div>
          </div>

          {/* MOBILE ADD TO CART */}
          <div className="mt-3 md:hidden">
            <AddToCartButton product={product} />
          </div>
        </div>
      </article>
    </Link>
  );
}
