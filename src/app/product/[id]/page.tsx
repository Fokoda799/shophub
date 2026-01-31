import ImageGalleryZoom from "../../../components/ImageGalleryZoom";
import { getAppwriteImageUrl, getProductById } from "../../../lib/products";
import Link from "next/link";
import { getPublicAppwriteImageUrl } from "../../../lib/appwrite-client-urls";

type ParamsShape = { id: string };

async function resolveParams(input: unknown): Promise<ParamsShape> {
  // If it's promise-like, await it
  const maybeResolved = await Promise.resolve(input as never);

  // Sometimes it resolves to a JSON string like "{\"id\":\"...\"}"
  if (typeof maybeResolved === "string") {
    const parsed = JSON.parse(maybeResolved);
    return parsed as ParamsShape;
  }

  // Normal case: it resolves to an object { id: "..." }
  return maybeResolved as ParamsShape;
}

export default async function ProductPage({ params }: { params: unknown }) {
  const resolved = await resolveParams(params);

  if (!resolved?.id) {
    throw new Error("Product ID is missing after resolving params");
  }

  const product = await getProductById(resolved.id);

  const imageUrls =
    product.imageFileIds?.map((fid) => getPublicAppwriteImageUrl(fid)) ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between border-b border-rose-100/50">
        <Link 
          className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity" 
          href="/"
        >
          Elegance
        </Link>
        <Link 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-rose-200 text-rose-600 font-medium hover:bg-rose-50 transition-all duration-300" 
          href="/shop"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shop
        </Link>
      </header>

      {/* Product Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="bg-white rounded-3xl p-4 shadow-lg border border-rose-100/50">
            <ImageGalleryZoom imageUrls={imageUrls} alt={product.title} />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-rose-600 transition-colors">Shop</Link>
              <span>/</span>
              <span className="text-gray-700">{product.title}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">
                {product.price.toFixed(2)} MAD
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Free shipping on orders over $100
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Premium quality materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Expert craftsmanship</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">30-day returns guarantee</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Fast & secure shipping</span>
                </li>
              </ul>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full py-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 mb-4">
              Add to Cart
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 rounded-full border-2 border-rose-600 text-rose-600 font-semibold hover:bg-rose-50 transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save
              </button>
              <button className="py-3 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-gray-700">Secure Payment</div>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-gray-700">Gift Packaging</div>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-gray-700">Easy Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent mb-4">
                Elegance
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your destination for premium women's bags and accessories.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/shop" className="hover:text-rose-400 transition-colors">All Bags</Link></li>
                <li><Link href="/new-arrivals" className="hover:text-rose-400 transition-colors">New Arrivals</Link></li>
                <li><Link href="/bestsellers" className="hover:text-rose-400 transition-colors">Bestsellers</Link></li>
                <li><Link href="/sale" className="hover:text-rose-400 transition-colors">Sale</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/contact" className="hover:text-rose-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-rose-400 transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-rose-400 transition-colors">Returns</Link></li>
                <li><Link href="/faq" className="hover:text-rose-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-rose-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">Pinterest</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">TikTok</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Elegance. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <Link href="/privacy" className="hover:text-rose-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-rose-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}