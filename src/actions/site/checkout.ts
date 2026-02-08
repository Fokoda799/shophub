"use server";

import { ID, Query } from "node-appwrite";

import { createAppwriteServer } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";

const {
  databaseId,
  ordersCollectionId,
  orderItemsCollectionId,
  productsCollectionId,
} = appwriteConfig;

type CartItemInput = {
  productId: string;
  quantity: number;
};

type ProductDoc = {
  $id: string;
  title?: unknown;
  price?: unknown;
  isActive?: unknown;
};

function toInt(value: unknown, fallback = 0): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.floor(n);
}

function parseCartItems(itemsRaw: string): CartItemInput[] {
  try {
    const parsed = JSON.parse(itemsRaw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((x) => x && typeof x === "object")
      .map((x) => ({
        productId: String((x as { productId?: unknown }).productId ?? "").trim(),
        quantity: toInt((x as { quantity?: unknown }).quantity ?? 0, 0),
      }))
      .filter((x) => x.productId && x.quantity > 0);
  } catch {
    return [];
  }
}

export const createOrder = async (formData: FormData) => {

  const orderNumber = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const itemsRaw = String(formData.get("items") ?? "[]");
  const ipAddress = String(formData.get("ipAddress"));
  const userAgent = String(formData.get("userAgent"));
  const sourceCountry = String(formData.get("sourceCountry"));

  const status = "ordered";

  if (!fullName) throw new Error("Full name is required");
  if (!phone) throw new Error("Phone number is required");
  if (!address) throw new Error("Address is required");
  if (!city) throw new Error("City is required");
  if (!postalCode) throw new Error("Postal code is required");

  const items = parseCartItems(itemsRaw);

  if (items.length === 0) throw new Error("Cart is empty");

  const qtyById = new Map<string, number>();
  for (const it of items) {
    qtyById.set(it.productId, (qtyById.get(it.productId) ?? 0) + it.quantity);
  }
  const productIds = Array.from(qtyById.keys());

  const { databases } = createAppwriteServer();

  const productsRes = await databases.listDocuments(databaseId, productsCollectionId, [
    Query.equal("$id", productIds),
    Query.limit(100),
  ]);

  const products = productsRes.documents;
  const productById = new Map(products.map((p) => [p.$id, p]));

  const missing = productIds.filter((id) => !productById.has(id));
  if (missing.length) {
    throw new Error(`Some items are no longer available: ${missing.join(", ")}`);
  }

  const orderItems = productIds.map((id) => {
    const p = productById.get(id) as ProductDoc;

    if (p.isActive === false) {
      throw new Error(`Product unavailable: ${p.title ?? id}`);
    }

    const price = Number(p.price);
    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`Invalid price for product: ${p.title ?? id}`);
    }

    const quantity = qtyById.get(id)!;

    return {
      productId: id,
      title: String(p.title ?? "").trim(),
      price,
      quantity,
      lineTotal: price * quantity,
    };
  });

  const totalAmount = orderItems.reduce((sum, it) => sum + it.lineTotal, 0);

  const orderDoc = await databases.createDocument(
    databaseId,
    ordersCollectionId,
    ID.unique(),
    {
      orderNumber,
      fullName,
      phone,
      email: email || undefined,
      address,
      city,
      postalCode,
      totalAmount,
      notes: notes || undefined,
      ipAddress,
      userAgent,
      sourceCountry,
      status,
    }
  );

  await Promise.all(
    orderItems.map((it) =>
      databases.createDocument(databaseId, orderItemsCollectionId, ID.unique(), {
        oreders: orderDoc.$id,
        $id: it.productId,
        title: it.title,
        price: it.price,
        quantity: it.quantity,
      })
    )
  );

  return { ok: true, id: orderDoc.$id, orderNumber, totalAmount, items: orderItems };
};
