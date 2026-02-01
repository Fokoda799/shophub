import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-serif text-2xl font-bold bg-linear-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent mb-4">
              Elegance
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your destination for premium women&apos;s bags and accessories.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/shop" className="hover:text-rose-400 transition-colors">All Bags</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-rose-400 transition-colors">New Arrivals</Link></li>
              <li><Link href="/bestsellers" className="hover:text-rose-400 transition-colors">Bestsellers</Link></li>
              <li><Link href="/sale" className="hover:text-rose-400 transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/contact" className="hover:text-rose-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-rose-400 transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-rose-400 transition-colors">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-rose-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-rose-400 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Pinterest</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">TikTok</a></li>
            </ul>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className=" pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
  )
}

export default Footer