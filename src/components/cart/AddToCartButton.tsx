"use client";

import { MouseEvent, useState } from "react";
import { ProductDoc } from "@/types/product";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import { getPublicAppwriteImageUrl } from "@/lib/appwrite/client";

export default function AddToCartButton({ product }: { product: ProductDoc }) {
  const copy = useLanguage("product_card");
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  
  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsAdding(true);

    addItem({
      productId: product.$id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.imageFileIds?.[0]
        ? getPublicAppwriteImageUrl(product.imageFileIds[0])
        : null,
    });

    window.dispatchEvent(new Event("cart:updated"));

    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`flex w-full items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all ${
        isAdding
          ? "bg-green-600 hover:bg-green-600"
          : "bg-gray-900 hover:bg-gray-800"
      }`}
    >
      {isAdding ? (
        <>
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {copy.added}
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {copy.add_to_cart}
        </>
      )}
    </Button>
  );
}
