"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  X,
  Trash2,
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
  locale: 'en' | 'fr' | 'ar';
  dict: any;
  isOpen: boolean;
  onClose?: () => void;
  currency?: string;
  shipping?: number;
  tax?: number;
};

const FREE_SHIPPING_THRESHOLD = 500;

const formatMoney = (value: number, currency: string, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

const CartSidebar = ({
  locale,
  dict,
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
    window.dispatchEvent(new Event("cart:updated"));
  };

  const onIncDec = (id: string, delta: number) => {
    const updatedItems = items
      .map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) {
            localStorage.removeItem(`cart_item_${id}`);
            return null;
          }
          const updatedItem = { ...item, quantity: newQuantity };
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
      })
      .filter((item): item is CartItem => item !== null);

    setItems(updatedItems);
    window.dispatchEvent(new Event("cart:updated"));
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`absolute top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300
          ${locale === "ar" ? "left-0" : "right-0"}
          ${
            isOpen
              ? "translate-x-0"
              : locale === "ar"
              ? "-translate-x-full"
              : "translate-x-full"
          }
        `}
        role="dialog"
        aria-modal="true"
      >

        <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-gray-900" />
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
                  {dict.title}
                </h2>
                <p className="text-xs text-gray-500">
                  {items.length} {items.length === 1 ? dict.item_singular : dict.item_plural}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-sm p-2 transition-colors hover:bg-gray-100"
              aria-label={dict.close_aria}
            >
              <X className="h-5 w-5 text-gray-900" />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {remainingForFree > 0 && items.length > 0 && (
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {dict.free_shipping_at.replace("{amount}", formatMoney(FREE_SHIPPING_THRESHOLD, currency, "en-US"))}
                  </span>
                  <span className="text-xs font-bold text-gray-900">
                    {dict.to_go.replace("{amount}", formatMoney(remainingForFree, currency, "en-US"))}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden bg-gray-200">
                  <div
                    className="h-full bg-gray-900 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-black uppercase text-gray-900">
                    {dict.empty_title}
                  </h3>
                  <p className="mb-6 text-sm text-gray-500">
                    {dict.empty_desc}
                  </p>
                  <button
                    className="rounded-sm bg-gray-900 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gray-800"
                    onClick={onClose}
                  >
                    {dict.continue_shopping}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-gray-100 pb-4 last:border-0"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-gray-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-300">
                            <ShoppingBag className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-bold uppercase text-gray-900">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => onRemove(item.id)}
                              className="shrink-0 p-1 text-gray-400 transition-colors hover:text-gray-900"
                              aria-label={dict.remove_item_aria}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {item.variant && (
                            <p className="mt-1 text-xs text-gray-500">{item.variant}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onIncDec(item.id, -1)}
                              className="flex h-8 w-8 items-center justify-center border border-gray-300 bg-white transition-colors hover:border-gray-900"
                              aria-label={dict.decrease_qty_aria}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onIncDec(item.id, 1)}
                              className="flex h-8 w-8 items-center justify-center border border-gray-300 bg-white transition-colors hover:border-gray-900"
                              aria-label={dict.increase_qty_aria}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm font-black text-gray-900">
                            {formatMoney(item.price * item.quantity, currency, "en-US")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-6">
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{dict.subtotal}</span>
                  <span className="font-bold text-gray-900">
                    {formatMoney(subtotal, currency, "en-US")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{dict.shipping}</span>
                  <span className="font-bold text-gray-900">
                    {shipping === 0 ? dict.shipping_free : formatMoney(shipping, currency, "en-US")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{dict.tax}</span>
                  <span className="font-bold text-gray-900">
                    {formatMoney(tax, currency, "en-US")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-base">
                  <span className="font-black uppercase">{dict.total}</span>
                  <span className="text-xl font-black text-gray-900">
                    {formatMoney(total, currency, "en-US")}
                  </span>
                </div>
              </div>

              <button
                className="mb-3 flex w-full items-center justify-center gap-2 bg-gray-900 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gray-800"
                onClick={() => alert(dict.checkout_coming_soon)}
              >
                {dict.checkout}
                <ShieldCheck className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{dict.secure_note}</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CartSidebar;
