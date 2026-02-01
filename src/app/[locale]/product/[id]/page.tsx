import ImageGalleryZoom from "../../../../components/ImageGalleryZoom";
import { getProductById } from "../../../../lib/products";
import Link from "next/link";
import { getPublicAppwriteImageUrl } from "../../../../lib/appwrite-client-urls";
import AddToCartButton from "../../../../components/AddToCartButton";
import { getDictionary } from "../../../../lib/dictionaries";
import type { Locale } from "../../../../../i18n.config";
import Header from "../../../../components/Header";

type ParamsShape = {
  params: { locale: Locale; id: string };
};

async function resolveParams(params: unknown): Promise<ParamsShape> {
  // Await the thenable/promise or return the object directly
  const awaited = await Promise.resolve(params as any);

  // Sometimes Next gives params as a JSON string (as you saw)
  if (typeof awaited === "string") {
    return JSON.parse(awaited) as ParamsShape;
  }

  return awaited as ParamsShape;
}


export default async function ProductPage({ params }: ParamsShape) {
  const { locale, id } = await resolveParams(params);

  if (!id) {
    throw new Error("Product ID is missing");
  }

  const dict = await getDictionary(locale); // dict is the whole JSON
  // If your JSON has dict.product.* then keep it like this:
  const t = dict.product;

  const product = await getProductById(id);

  const imageUrls =
    product.imageFileIds?.map((fid) => getPublicAppwriteImageUrl(fid)) ?? [];

  return (
      <>
        <Header locale={locale} dict={dict.header} />
        <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-7xl px-6 py-8 md:py-16">
          <Link
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-600 transition-colors hover:text-gray-900"
            href={`/${locale}`} // ✅ keep locale in links
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.product.back}
          </Link>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="bg-gray-50">
              <ImageGalleryZoom imageUrls={imageUrls} alt={product.title} />
            </div>

            <div className="flex flex-col">
              <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
                <Link href={`/${locale}`} className="transition-colors hover:text-gray-900">
                  {t.product.home}
                </Link>
                <span>/</span>
                <Link href={`/${locale}/shop`} className="transition-colors hover:text-gray-900">
                  {t.product.shop}
                </Link>
              </div>

              <h1 className="mb-6 text-4xl font-black uppercase leading-tight tracking-tight text-gray-900 md:text-5xl">
                {product.title}
              </h1>

              <div className="mb-8 border-b border-gray-200 pb-8">
                <div className="mb-2 text-3xl font-black text-gray-900">
                  {product.price.toFixed(2)} {t.product.currency}
                </div>
                <div className="text-sm text-gray-600">{t.product.tax_info}</div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-900">
                  {t.product.description}
                </h2>
                <p className="leading-relaxed text-gray-700">{product.description}</p>
              </div>

              <div className="mb-8 space-y-3 border-y border-gray-200 py-8">
                {t.product.features?.map(
                  (feature: { icon: string; text: string }, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature.text}</span>
                    </div>
                  )
                )}
              </div>

              <div className="space-y-4">
                <AddToCartButton product={product} />

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 border border-gray-300 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:border-gray-900 hover:bg-gray-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {t.product.favorite}
                  </button>

                  <button className="flex items-center justify-center gap-2 border border-gray-300 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:border-gray-900 hover:bg-gray-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {t.product.share}
                  </button>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-gray-200 pt-8">
                {t.product.guarantees?.map(
                  (guarantee: { icon: string; label: string }, index: number) => (
                    <div key={index} className="text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-6 w-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={guarantee.icon} />
                        </svg>
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wide text-gray-700">
                        {guarantee.label}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
        </main>
      </>
  );
}
