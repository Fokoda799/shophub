import ProductCard from "../../components/ProductCard";
import { listProducts } from "../../lib/products";
import Link from "next/link";

export default async function ShopPage() {
  const products = await listProducts();

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Our Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover handpicked bags designed to elevate your style. Each piece combines elegance with functionality.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100/50 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-medium text-gray-700">{products.length}</span>
            <span className="text-gray-600">Products</span>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium text-sm hover:shadow-lg transition-all duration-300">
              All Bags
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:border-rose-600 hover:text-rose-600 transition-colors">
              New Arrivals
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:border-rose-600 hover:text-rose-600 transition-colors">
              Best Sellers
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.$id} product={p} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-3">
              No Products Yet
            </h3>
            <p className="text-gray-600 mb-8">
              Our collection is being curated. Check back soon for beautiful bags!
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
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