"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Package, Truck } from "lucide-react";
import { getPublicAppwriteImageUrl } from "@/lib/appwrite/client";
import { useLanguage, useLocale } from "@/context/LanguageContext";
import { withLocalePath } from "@/features/i18n/routing";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

type OrderItemForServer = {
  productId: string;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useLanguage("checkout");
  const { items, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  // UI-only totals (do NOT send to server)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Send ONLY productIds + quantities
      const orderItemsForServer: OrderItemForServer[] = items
        .map((it) => ({
          productId: String(it.productId),
          quantity: Number(it.quantity),
        }))
        .filter((it) => it.productId && Number.isFinite(it.quantity) && it.quantity > 0);

      if (orderItemsForServer.length === 0) {
        alert(t.empty_desc);
        return;
      }

      // ✅ Payload: no client prices/totals
      const orderPayload = {
        ...formData,
        items: orderItemsForServer,
        // optional metadata (server can also compute date)
        orderDate: new Date().toISOString(),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        // Clear cart (client)
        clearCart();
        window.dispatchEvent(new Event("cart:updated"));

        router.push(withLocalePath("/order-success", locale));
      } else {
        let message = t.order_failed;
        try {
          const errorPayload = await response.json();
          if (errorPayload?.error) message = String(errorPayload.error);
          console.error("Order API error:", { status: response.status, body: errorPayload });
        } catch (parseError) {
          console.error("Order API error: failed to parse response", parseError);
        }
        alert(message);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert(t.error_occurred);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-16">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-black uppercase text-gray-900">{t.empty_title}</h1>
          <p className="mb-6 text-gray-600">{t.empty_desc}</p>
          <button
            onClick={() => router.push(withLocalePath("/shop", locale))}
            className="rounded-sm bg-gray-900 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-gray-800"
          >
            {t.continue_shopping}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <h1 className="mb-8 text-3xl font-black uppercase text-gray-900 md:text-4xl">
          {t.title}
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="border border-gray-200 p-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-900">
                  {t.contact_information}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
                      {t.full_name} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                      {t.phone_number} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                      {t.email_optional}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border border-gray-200 p-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-900">
                  {t.shipping_address}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
                      {t.street_address} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">
                        {t.city} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="mb-2 block text-sm font-medium text-gray-700">
                        {t.postal_code} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700">
                      {t.order_notes_optional}
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                      placeholder={t.notes_placeholder}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div
                className="fixed bottom-0 left-0 z-40 w-full bg-white py-6 px-2 lg:relative lg:bottom-auto lg:left-auto lg:z-auto lg:bg-transparent lg:p-0"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t.processing}
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      {t.place_order}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 border border-gray-200 p-6">
              <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-900">
                {t.order_summary}
              </h2>

              <div className="mb-6 space-y-4">
                {items.map((item) => {
                  const imageUrl = item.image
                    ? getPublicAppwriteImageUrl(item.image)
                    : null;

                  return (
                    <div key={item.productId} className="flex gap-4">
                      <div className="h-16 w-16 relative overflow-hidden shrink-0 border border-gray-200 bg-gray-50">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={item.title}
                            className="h-full w-full object-contain"
                            fill
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {t.qty}: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} {t.currency}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.subtotal}</span>
                  <span className="font-bold text-gray-900">
                    {subtotal.toFixed(2)} {t.currency}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.shipping}</span>
                  <span className="font-bold text-gray-900">{t.free}</span>
                </div>
                <div className="hidden justify-between text-sm">
                  <span className="text-gray-600">{t.tax}</span>
                  <span className="font-bold text-gray-900">
                    {tax.toFixed(2)} {t.currency}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                  <span className="font-black uppercase">{t.total}</span>
                  <span className="text-xl font-black text-gray-900">
                    {total.toFixed(2)} {t.currency}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t.secure_checkout}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>{t.free_shipping_all_items}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <Package className="h-4 w-4" />
                  <span>{t.returns_7_days}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
