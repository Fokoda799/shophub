"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import CartSidebar from "@/components/cart/CartSidebar";
import LanguageSwitcher from './LangSwitcher';
import Button from "@/components/ui/Button";
import { useLanguage, useLocale, useLocalizedPath } from "@/context/LanguageContext";

const Header = () => {
  const { locale } = useLocale();
  const header = useLanguage("header");
  const localize = useLocalizedPath();
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
    <>
      <header 
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrollY > 20 
            ? 'bg-white shadow-md' 
            : ''
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href={localize("/")} className="text-2xl font-black uppercase tracking-tight text-gray-900">
              Elegance
            </Link>

            <div className="flex items-center gap-4">
              <LanguageSwitcher className={`${
                  scrollY > 20 ? 'text-gray-900' : 'text-white hover:text-gray-200'  
                } lg:text-gray-900 hover:text-gray-700
              `} />

              <Button
                onClick={() => setOpenCart(true)}
                className="relative rounded-sm p-2 transition-colors hover:bg-gray-400 cursor-pointer"
                aria-label={header.cart.title}
              >
                <ShoppingCart className={`h-6 w-6 ${
                    scrollY > 20 ? 'text-gray-900' : 'text-white'  
                  } lg:text-gray-900 hover:text-gray-700
                `} />
                {itemsInCart > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                    {itemsInCart > 9 ? '9+' : itemsInCart}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <CartSidebar 
        locale={locale}
        isOpen={openCart} 
        onClose={() => {
          setOpenCart(false);
          window.dispatchEvent(new Event("cart:deleted"));
        }} 
      />
    </>
  );
};

export default Header;
