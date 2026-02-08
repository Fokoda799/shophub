import { getProductById } from "@/services/products";
import { getPublicAppwriteImageUrl } from "@/lib/appwrite/client";
import type { Locale } from "@config";
import ProductDetailsContent from "@/components/product/ProductDetailsContent";

type RouteParams = { locale: Locale; id: string };

async function resolveParams(params: RouteParams | Promise<RouteParams> | string): Promise<RouteParams> {
  const awaited = await Promise.resolve(params);

  if (typeof awaited === "string") {
    return JSON.parse(awaited) as RouteParams;
  }

  return awaited as RouteParams;
}

export default async function ProductPage({ params }: { params: RouteParams }) {
  const { id } = await resolveParams(params);

  if (!id) {
    throw new Error("Product ID is missing");
  }

  const product = await getProductById(id);

  const imageUrls =
    product.imageFileIds?.map((fid) => getPublicAppwriteImageUrl(fid)) ?? [];

  return <ProductDetailsContent product={product} imageUrls={imageUrls} />;
}
