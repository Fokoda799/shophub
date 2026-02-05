import ProductCard from "@/components/product/ProductCard";
import { listProducts } from "@/lib/products";
import Link from "next/link";
import type { Locale } from "@config";
import { getDictionary } from "@/lib/dictionaries";
import { withLocalePath } from "@/lib/locale-path";
import Pagination from "@/components/Pagination ";

const PRODUCTS_PER_PAGE = 12;

export default async function ShopPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: Locale }> | { locale: Locale };
  searchParams: Promise<{ page?: string }> | { page?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const allProducts = await listProducts();
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const homeCopy = dictionary.home;
  const productCopy = dictionary.product.product;
  const shopCopy = dictionary.shop;

  const currentPage = Number(resolvedSearchParams.page) || 1;
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const products = allProducts.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-white pt-14 md:pt-16">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              {homeCopy.collection.title}
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-gray-600 md:text-base">
              {shopCopy.hero_description}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-y border-gray-200 py-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-black text-gray-900">{allProducts.length}</span>
              <span className="uppercase tracking-wide text-gray-600">
                {homeCopy.collection.items}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button className="rounded-sm border border-gray-900 bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-gray-800 sm:px-6 sm:py-2.5 sm:text-sm">
                {homeCopy.collection.view_all}
              </button>
              <button className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-700 transition-colors hover:border-gray-900 hover:bg-gray-50 sm:px-6 sm:py-2.5 sm:text-sm">
                {shopCopy.new_arrivals}
              </button>
              <button className="rounded-sm border border-gray-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-700 transition-colors hover:border-gray-900 hover:bg-gray-50 sm:px-6 sm:py-2.5 sm:text-sm">
                {shopCopy.best_sellers}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.$id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  locale={locale}
                />
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 md:h-20 md:w-20">
              <svg
                className="h-8 w-8 text-gray-400 md:h-10 md:w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-black uppercase text-gray-900 md:text-3xl">
              {homeCopy.collection.coming_soon}
            </h3>
            <p className="mb-8 text-sm text-gray-600 md:text-base">
              {homeCopy.collection.launching_soon}
            </p>
            <Link
              href={withLocalePath("/", locale)}
              className="inline-block rounded-sm bg-gray-900 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-gray-800 md:px-8 md:py-4"
            >
              {productCopy.home}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
