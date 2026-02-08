
"use client";

import Link from "next/link";
import { CheckCircle, Package, Home } from "lucide-react";
import { useLanguage, useLocale } from "@/context/LanguageContext";
import { withLocalePath } from "@/features/i18n/routing";

export default function OrderSuccessPage() {
  const { locale } = useLocale();
  const t = useLanguage("order_success");

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 pt-16">
      <div className="max-w-md text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="mb-4 text-3xl font-black uppercase text-gray-900 md:text-4xl">
          {t.title}
        </h1>

        <p className="mb-8 text-gray-600">
          {t.description}
        </p>

        <div className="mb-8 space-y-3 border-y border-gray-200 py-6 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <Package className="h-4 w-4" />
            <span>{t.call_within_24h}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{t.delivery_eta}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href={withLocalePath("/", locale)}
            className="flex w-full items-center justify-center gap-2 bg-gray-900 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gray-800"
          >
            <Home className="h-4 w-4" />
            {t.back_to_home}
          </Link>

          <Link
            href={withLocalePath("/shop", locale)}
            className="flex w-full items-center justify-center gap-2 border border-gray-300 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 transition-colors hover:border-gray-900 hover:bg-gray-50"
          >
            {t.continue_shopping}
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          {t.need_help}
        </p>
      </div>
    </main>
  );
}
