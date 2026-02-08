import { ID } from "node-appwrite";
import { headers } from "next/headers";
import { createAppwriteServer } from "./appwrite-server";

const databaseId = process.env.APPWRITE_DATABASE_ID!;
const ordersCollectionId = process.env.APPWRITE_ORDERS_COLLECTION_ID!;
const orderItemsCollectionId = process.env.APPWRITE_ORDER_ITEMS_COLLECTION_ID!;
type OrderItemInput = {
  title: string;
  price: number;
  quantity: number;
};

export type ItemsDoc = {
  $id: string;
  orderId: string;
  title: string;
  price: number;
  quantity: number;
};

export type OrderDoc = {
  $id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode: string;
  items?: ItemsDoc[];
  totalAmount: number;
  notes?: string;
  ipAddress: string;
  userAgent: string;
  sourceCountry: string;
  status: "ordered" | "confirmed" | "processing" | "delivering" | "delivered" | "cancelled";
};

function toPrice(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error("Price must be a valid number");
  return n;
}

export const createOrder = async (formData: FormData, requestHeaders?: Headers) => {
  const h = requestHeaders ?? (await headers());

  const orderNumber = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const totalAmountRaw = String(formData.get("totalAmount") ?? "0");
  const notes = String(formData.get("notes") ?? "").trim();
  const itemsRaw = String(formData.get("items") ?? "[]");
  const ipAddress =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";
  const userAgent = h.get("user-agent") ?? "unknown";
  const sourceCountry =
    h.get("x-vercel-ip-country") ??
    h.get("cf-ipcountry") ??
    "unknown";
  const status = "ordered";

  if (!fullName) throw new Error("Full name is required");
  if (!phone) throw new Error("Phone number is required");
  if (!address) throw new Error("Address is required");
  if (!city) throw new Error("City is required");
  if (!postalCode) throw new Error("Postal code is required");

  let items: OrderItemInput[] = [];
  try {
    const parsed = JSON.parse(itemsRaw);
    if (Array.isArray(parsed)) {
      items = parsed
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          title: String(item.title ?? "").trim(),
          price: toPrice(String(item.price ?? "0")),
          quantity: Number(item.quantity ?? 0),
        }))
        .filter((item) => item.title && item.quantity > 0);
    }
  } catch {
    items = [];
  }

  const computedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const parsedTotal = toPrice(totalAmountRaw);
  const totalAmount = parsedTotal > 0 ? parsedTotal : computedTotal;

  const { databases } = createAppwriteServer();
  const doc = await databases.createDocument(
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

  if (items.length > 0) {
    await Promise.all(
      items.map((item) =>
        databases.createDocument(databaseId, orderItemsCollectionId, ID.unique(), {
          oreders: doc.$id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })
      )
    );
  }

  return { ok: true, id: doc.$id, orderNumber };
};
