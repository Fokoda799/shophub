import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <div className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
          Elegance
        </div>
        <nav className="flex gap-6 items-center">
          <Link 
            className="text-gray-700 hover:text-rose-600 transition-colors font-medium" 
            href="/shop"
          >
            Shop
          </Link>
          <Link 
            className="text-gray-700 hover:text-rose-600 transition-colors font-medium" 
            href="/about"
          >
            About
          </Link>
          <Link 
            className="text-gray-700 hover:text-rose-600 transition-colors font-medium" 
            href="/contact"
          >
            Contact
          </Link>
        </nav>
      </header>
  )
}

export default Header