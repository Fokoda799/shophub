import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Header */}
      
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent mb-6">
            Discover Your Perfect Bag
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Curated collection of premium women's bags. Each piece is carefully selected to complement your unique style and elevate your everyday elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/shop"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Explore Collection
            </Link>
            <Link
              href="/new-arrivals"
              className="px-8 py-4 rounded-full border-2 border-rose-600 text-rose-600 font-semibold hover:bg-rose-50 transition-all duration-300"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-rose-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Premium Quality</h3>
            <p className="text-gray-600 leading-relaxed">
              Handpicked materials and expert craftsmanship in every bag we offer. Quality you can feel and see.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-rose-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Fast Shipping</h3>
            <p className="text-gray-600 leading-relaxed">
              Swift and secure delivery to your doorstep. Track your order every step of the way.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-rose-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Satisfaction Guaranteed</h3>
            <p className="text-gray-600 leading-relaxed">
              30-day returns and dedicated customer support. Your happiness is our priority.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Ready to Find Your Perfect Bag?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Browse our exclusive collection and discover the bag that speaks to your style.
          </p>
          <Link
            href="/shop"
            className="inline-block px-10 py-4 rounded-full bg-white text-rose-600 font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Shop Now
          </Link>
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