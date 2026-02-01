"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { getPublicAppwriteImageUrl } from "../lib/appwrite-client-urls";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  variant?: string;
};

type CartSidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
  currency?: string;
  shipping?: number;
  tax?: number;
};

const FREE_SHIPPING_THRESHOLD = 120;

const formatMoney = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

const CartSidebar = ({
  isOpen,
  onClose,
  currency = "MAD",
  shipping = 0,
  tax = 0,
}: CartSidebarProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shipping + tax;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!isOpen) return;

    const itemsLocal: CartItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("cart_item_")) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsedItem = JSON.parse(item);
          itemsLocal.push({
            id: parsedItem.productId,
            name: parsedItem.title,
            price: parsedItem.price,
            quantity: parsedItem.quantity,
            image: parsedItem.imageFileIds?.[0]
              ? getPublicAppwriteImageUrl(parsedItem.imageFileIds[0])
              : null,
          });
        }
      }
    }

    setItems(itemsLocal);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  const onRemove = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.removeItem(`cart_item_${id}`);
  };

  const onIncDec = (id: string, delta: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, quantity: item.quantity + delta };
        localStorage.setItem(
          `cart_item_${id}`,
          JSON.stringify({
            productId: updatedItem.id,
            title: updatedItem.name,
            price: updatedItem.price,
            quantity: updatedItem.quantity,
            imageFileIds: updatedItem.image ? [updatedItem.image] : [],
          })
        );
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-105 transform bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative flex h-full flex-col overflow-hidden">
          <div className="absolute -right-24 top-16 h-48 w-48 rounded-full bg-rose-100 blur-3xl" />
          <div className="absolute -left-24 top-64 h-52 w-52 rounded-full bg-amber-100 blur-3xl" />

          <header className="relative flex shrink-0 items-center justify-between border-b border-rose-100/70 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 p-3 text-white shadow-lg">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
                  Your Cart
                </p>
                <h2 className="text-xl font-semibold text-gray-900">
                  Shopping Bag
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border cursor-pointer border-rose-100 bg-white p-2 text-gray-500 transition hover:border-rose-200 hover:text-rose-600"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="px-6 pt-6">
              <div className="rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-sm text-rose-700">
                {remainingForFree === 0 ? (
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    <span>Free shipping unlocked. Enjoy!</span>
                  </div>
                ) : (
                  <span>
                    Spend{" "}
                    <span className="font-semibold">
                      {formatMoney(remainingForFree, currency)}
                    </span>{" "}
                    more for free shipping.
                  </span>
                )}
                <div className="mt-3 h-1.5 w-full rounded-full bg-rose-100">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 px-6 pb-6 pt-6">
              {items.length === 0 ? (
                <div className="mt-10 rounded-3xl border border-dashed border-rose-200 bg-white/80 p-10 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Explore our newest arrivals and save your favorites.
                  </p>
                  <button 
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-200 px-5 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                    onClick={onClose}
                  >
                    Continue shopping
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex gap-4 rounded-3xl border border-rose-100/70 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-rose-50">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-rose-300">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {item.name}
                            </h4>
                            {item.variant ? (
                              <p className="mt-1 text-xs text-gray-500">
                                {item.variant}
                              </p>
                            ) : null}
                          </div>
                          <button
                            onClick={() => onRemove?.(item.id)}
                            className="cursor-pointer shrink-0 rounded-full border border-transparent px-2 py-1 text-xs font-semibold text-gray-400 transition hover:border-rose-100 hover:text-rose-500"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-2 py-1">
                            <button
                              onClick={() => onIncDec?.(item.id, -1)}
                              className="cursor-pointer flex h-6 w-6 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm transition hover:bg-rose-100"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onIncDec?.(item.id, 1)}
                              className="cursor-pointer flex h-6 w-6 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm transition hover:bg-rose-100"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatMoney(item.price * item.quantity, currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-rose-100/70 bg-white/95 px-6 py-6 backdrop-blur">
              <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/60 p-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney(subtotal, currency)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? "Free" : formatMoney(shipping, currency)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney(tax, currency)}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-lg">
                    {formatMoney(total, currency)}
                  </span>
                </div>
              </div>

              <button 
                className="cursor-pointer mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
                onClick={() => alert("This feature will be added soon")} 
              >  
                Secure checkout
                <ShieldCheck className="h-4 w-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="h-4 w-4 text-rose-500" />
                <span>Encrypted checkout · 30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CartSidebar;