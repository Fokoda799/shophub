"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import CartSidebar from "@/components/site/cart/CartSidebar";
import LanguageSwitcher from "./LangSwitcher";
import Button from "@/components/ui/Button";
import { useLanguage, useLocale, useLocalizedPath } from "@/context/LanguageContext";

function getCartCount(): number {
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
}

export default function Header() {
  const { locale } = useLocale();
  const header = useLanguage("header");
  const localize = useLocalizedPath();

  const [isScrolled, setIsScrolled] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [itemsInCart, setItemsInCart] = useState(0);

  // Handle scroll with debounce for performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function handleScroll() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 20);
      }, 10);
    }

    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle cart count updates
  useEffect(() => {
    function updateCount() {
      setItemsInCart(getCartCount());
    }

    updateCount(); // Initial count

    window.addEventListener("cart:updated", updateCount);
    window.addEventListener("cart:deleted", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cart:updated", updateCount);
      window.removeEventListener("cart:deleted", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  function handleOpenCart() {
    setOpenCart(true);
  }

  function handleCloseCart() {
    setOpenCart(false);
    window.dispatchEvent(new Event("cart:deleted"));
  }

  return (
    <>
      <header
        className={`
          fixed left-0 right-0 top-0 z-50 transition-all duration-300
          ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}
        `}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href={localize("/")}
              className={`
                text-2xl font-black uppercase tracking-tight transition-colors
                ${isScrolled ? "text-gray-900" : "text-white lg:text-gray-900"}
              `}
            >
              Elegance
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageSwitcher
                className={`
                  transition-colors
                  ${isScrolled 
                    ? "text-gray-900 hover:text-gray-700" 
                    : "text-white hover:text-gray-200 lg:text-gray-900 lg:hover:text-gray-700"
                  }
                `}
              />

              {/* Cart Button */}
              <Button
                onClick={handleOpenCart}
                className="relative rounded-sm p-2 transition-colors hover:bg-gray-100"
                aria-label={header.cart.title}
              >
                <ShoppingCart
                  className={`
                    h-6 w-6 transition-colors
                    ${isScrolled 
                      ? "text-gray-900" 
                      : "text-white lg:text-gray-900"
                    }
                  `}
                />
                {itemsInCart > 0 && (
                  <span
                    className="
                      absolute -right-1 -top-1 
                      flex h-5 w-5 items-center justify-center 
                      rounded-full bg-gray-900 
                      text-xs font-bold text-white
                      shadow-sm
                    "
                    aria-label={`${itemsInCart} items in cart`}
                  >
                    {itemsInCart > 9 ? "9+" : itemsInCart}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar locale={locale} isOpen={openCart} onClose={handleCloseCart} />
    </>
  );
}
