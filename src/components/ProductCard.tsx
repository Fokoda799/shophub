"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductDoc } from "../lib/products";
import { getPublicAppwriteImageUrl } from "../lib/appwrite-client-urls";

export default function ProductCard({ product }: { product: ProductDoc }) {
  const coverId = product.imageFileIds?.[0];
  const coverUrl = coverId ? getPublicAppwriteImageUrl(coverId) : null;
  
  // Validate URL
  const isValidUrl = coverUrl && coverUrl.startsWith('http');

  return (
    <Link
      href={`/product/${product.$id}`}
      className="group block"
    >
      <div className="bg-white rounded-3xl overflow-hidden border border-rose-100/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        {/* Image Container */}
        <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 relative overflow-hidden">
          {isValidUrl ? (
            <>
              <Image
                src={coverUrl}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-rose-300">
              <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">No image</span>
            </div>
          )}
          
          {/* Quick View Badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>

          {/* Favorite Icon */}
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-rose-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add to favorites logic
              }}
            >
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
            {product.title}
          </h3>

          {/* Description - Optional */}
          {product.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price and CTA */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <button 
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:shadow-lg transform hover:scale-105"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
            >
              Add to Cart
            </button>
          </div>

          {/* Rating - Optional */}
          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-4 h-4 text-amber-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}