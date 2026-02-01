"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductDoc } from "../lib/products";
import { getPublicAppwriteImageUrl } from "../lib/appwrite-client-urls";
import { useEffect, useState } from "react";

type ProductCardDict = {
  no_image: string;
  viewed: string;
  add_to_cart: string;
  added: string;
  rating: string;
  currency: string;
};

const defaultDict: ProductCardDict = {
  no_image: "No Image",
  viewed: "Viewed",
  add_to_cart: "Add to Cart",
  added: "Added",
  rating: "(4.5)",
  currency: "MAD",
};

export default function ProductCard({
  product,
  dict,
}: {
  product: ProductDoc;
  dict?: ProductCardDict;
}) {
  const coverId = product.imageFileIds?.[0];
  const coverUrl = coverId ? getPublicAppwriteImageUrl(coverId) : null;
  const [seenFlag, setSeenFlag] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const copy = dict ?? defaultDict;
  
  const isValidUrl = coverUrl && coverUrl.startsWith('http');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    const key = `cart_item_${product.$id}`;
    const existingRaw = localStorage.getItem(key);
    let nextQuantity = 1;

    if (existingRaw) {
      try {
        const existing = JSON.parse(existingRaw);
        if (typeof existing?.quantity === "number") {
          nextQuantity = existing.quantity + 1;
        }
      } catch {
        nextQuantity = 1;
      }
    }

    localStorage.setItem(
      key,
      JSON.stringify({
        productId: product.$id,
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: nextQuantity,
        imageFileIds: product.imageFileIds,
      })
    );

    window.dispatchEvent(new Event("cart:updated"));
    
    setTimeout(() => setIsAddingToCart(false), 1000);
  }

  useEffect(() => {
    setSeenFlag(localStorage.getItem(`seen_product_${product.$id}`) !== null);
  }, [product.$id]);

  const markAsSeen = () => {
    localStorage.setItem(`seen_product_${product.$id}`, Date.now().toString());
  }

  return (
    <Link
      href={`/product/${product.$id}`}
      className="group block"
      onClick={markAsSeen}
    >
      <article className="overflow-hidden bg-white transition-all duration-300 hover:shadow-xl">
        <div className="relative aspect-3/4 overflow-hidden">
          {isValidUrl ? (
            <>
              <Image
                src={coverUrl}
                alt={product.title}
                fill
                className="object-contain transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 120vw, (max-width: 1024px) 60vw, 30vw"
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
          
          {seenFlag && (
            <div className="absolute left-3 top-3">
              <div className="rounded bg-gray-900/80 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {copy.viewed}
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-white p-4 transition-transform duration-300 group-hover:translate-y-0">
            <button 
              className={`flex w-full items-center justify-center gap-2 rounded-sm bg-gray-900 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-gray-800 ${
                isAddingToCart ? 'bg-green-600 hover:bg-green-600' : ''
              }`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {copy.added}
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {copy.add_to_cart}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold uppercase tracking-wide text-gray-900">
              {product.title}
            </h3>
          </div>

          {product.description && (
            <p className="mb-3 line-clamp-2 text-xs text-gray-600">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="text-lg font-black text-gray-900">
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
              <span className="ml-1 text-xs text-gray-500">{copy.rating}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
