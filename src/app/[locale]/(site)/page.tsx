import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { listProducts } from "@/lib/products";
import type { Locale } from '@config';
import { getDictionary } from "@/lib/dictionaries";
import { withLocalePath } from "@/lib/locale-path";
import ScrollToCollectionButton from "@/components/layout/ScrollToCollectionButton";

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const products = await listProducts();
  const { locale } = await params;
  const j = await getDictionary(locale);
  const dict = j.home;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Adidas Style */}
      <section className="relative lg:h-[85vh] h-screen min-h-160 overflow-hidden bg-gray-900">
        {/* Full-bleed Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt={dict.hero.alt}
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />

          <div className="absolute inset-0 bg-black/30" />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto flex h-full max-w-7xl flex-col lg:justify-end justify-center px-6 pb-16 md:pb-20">
          <div className="max-w-2xl mt-20 lg:mt-0">
            {/* Small badge */}
            <div className="mb-4 inline-block rounded bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              {dict.hero.badge}
            </div>

            {/* Main headline - Bold and impactful */}
            <h1 className="mb-6 text-5xl font-black uppercase leading-none tracking-tight text-white md:text-7xl lg:text-8xl">
              {dict.hero.headline}
            </h1>

            {/* Subheadline */}
            <p className="mb-8 max-w-lg text-lg font-medium text-white/90 md:text-xl">
              {dict.hero.subheadline}
            </p>

            {/* Category Chips - Adidas style */}
            <div className="flex flex-wrap gap-3">
              <ScrollToCollectionButton
                label={dict.hero.shop_women}
                className="group relative overflow-hidden rounded-sm bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-gray-900 transition-all hover:bg-gray-100"
              />

              {/* <Link
                href={withLocalePath("/shop/new", locale)}
                className="group relative overflow-hidden rounded-sm border-2 border-white bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-white hover:text-gray-900"
              >
                <span className="relative z-10">{dict.hero.new_in}</span>
              </Link>
              <Link
                href={withLocalePath("/shop/sale", locale)}
                className="group relative overflow-hidden rounded-sm border-2 border-white/50 bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white/10"
              >
                <span className="relative z-10">{dict.hero.sale}</span>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute lg:bottom-6 bottom-2 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs font-medium uppercase tracking-widest">{dict.hero.scroll}</span>
            <svg className="h-6 w-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Quick Links Bar */}
      {/* <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-900">{dict.quick_links.popular}:</span>
            {dict.quick_links.categories.map((item: string) => (
                <Link
                  key={item}
                  href={withLocalePath(`/shop/${item.toLowerCase().replace(' ', '-')}`, locale)}
                className="whitespace-nowrap rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:bg-gray-50"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Collection Section */}
      <section id="collection" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section Header - Minimal */}
          <div className="mb-12 flex items-end justify-between border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 md:text-4xl">
                {dict.collection.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {products.length} {dict.collection.items}
              </p>
            </div>
            <Link
              href={withLocalePath("/shop", locale)}
              className="hidden text-sm font-bold uppercase tracking-wide text-gray-900 underline underline-offset-4 transition hover:text-gray-600 md:block"
            >
              {dict.collection.view_all}
            </Link>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.$id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-2xl font-black uppercase text-gray-900">
                {dict.collection.coming_soon}
              </h3>
              <p className="mt-2 text-gray-600">
                {dict.collection.launching_soon}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Secondary Full-width Banner */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-gray-100">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-rose-100 to-amber-100" />
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-xl">
            <div className="mb-4 inline-block rounded bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-gray-900">
              {dict.sustainability.badge}
            </div>
            <h2 className="mb-6 text-4xl font-black uppercase leading-tight text-gray-900 md:text-6xl">
              {dict.sustainability.headline}
            </h2>
            <p className="mb-8 text-lg text-gray-700">
              {dict.sustainability.subheadline}
            </p>
            {/* <Link
              href={withLocalePath("/sustainability", locale)}
              className="inline-block rounded-sm bg-gray-900 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
            >
              {dict.sustainability.learn_more}
            </Link> */}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-row flex-wrap items-center justify-around">
            {dict.stats.map(
              (stat: { value: string; label: string }, index: number) => (
                <div key={index} className="text-center">
                  <div className="mb-1 text-3xl font-black text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm uppercase tracking-wide text-gray-600">
                    {stat.label}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
