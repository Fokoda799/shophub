import { useState, useEffect } from 'react';
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react';
import CartSidebar from './CartSidebar';

const Header = ({pathname}: {pathname: string}) => {
  const [scrollY, setScrollY] = useState(0);
  const [openCart, setOpenCart] = useState(false);
  const [itemsInCart, setItemsInCart] = useState(0);

  const getCartCount = () => {
    if (typeof window === "undefined") return 0;
    return Object.keys(localStorage)
      .filter((key) => key.startsWith("cart_item_"))
      .reduce((count, key) => {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) return count;
          const item = JSON.parse(raw);
          return count + (typeof item?.quantity === "number" ? item.quantity : 1);
        } catch {
          return count + 1;
        }
      }, 0);
  };

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateCount = () => {
      setItemsInCart(getCartCount());
    };

    updateCount();
    window.addEventListener("cart:updated", updateCount);
    window.addEventListener("cart:deleted", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cart:updated", updateCount);
      window.removeEventListener("cart:deleted", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrollY > 0 ? 'bg-white shadow-md' : 'bg-transparent'} mx-auto max-w-7xl px-6 py-5 flex items-center justify-between`}>
        <div className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
          Elegance
        </div>
        <nav className="flex gap-6 items-center">
          {pathname === '/' ? (
            <Link 
              className="text-gray-700 hover:text-rose-600 transition-colors font-medium" 
              href="/shop"
            >
              Shop
            </Link>
          ) :
            <div
              className="text-gray-700 relative hover:text-rose-600 transition-colors font-medium cursor-pointer"
              onClick={() => setOpenCart(true)}  
            >
              <ShoppingCart />
              {itemsInCart > 0 && (
                <div className="absolute -top-2 -right-3 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  {itemsInCart}
                </div>
              )}
            </div>
          }
          {/* <Link 
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
          </Link> */}
        </nav>

        <CartSidebar isOpen={openCart} onClose={() => {
          setOpenCart(false)
          window.dispatchEvent(new Event("cart:deleted"));
        }} />
      </header>
  )
}

export default Header 
