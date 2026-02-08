"use server";

import { Query } from "node-appwrite";

import { createAppwriteServer } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";

import { OrderDoc, OrderItemDoc } from "@/types/order";
import { castDocument, castDocuments } from "@/types/cast";

const { databaseId, ordersCollectionId, orderItemsCollectionId } = appwriteConfig;


async function listItemsForOrder(orderId: string) {
  const { databases } = createAppwriteServer();

  try {
    return await databases.listDocuments(databaseId, orderItemsCollectionId, [
      Query.equal("oreders", orderId),
    ]);
  } catch {
    return await databases.listDocuments(databaseId, orderItemsCollectionId, [
      Query.equal("oreders", orderId),
    ]);
  }
}

/**
 * List all orders with optional status filter
 */
export async function listOrders(status?: string) {
  const { databases } = createAppwriteServer();

  const queries = [Query.orderDesc("$createdAt"), Query.limit(100)];
  
  if (status && status !== "all") {
    queries.push(Query.equal("status", status));
  }

  const result = await databases.listDocuments(
    databaseId,
    ordersCollectionId,
    queries
  );

  return castDocuments<OrderDoc>(result.documents);
}

/**
 * Get single order with its items
 */
export async function getOrder(orderId: string) {
  const { databases } = createAppwriteServer();

  const order = await databases.getDocument(
    databaseId,
    ordersCollectionId,
    orderId
  );

  // Get related items
  const items = await listItemsForOrder(orderId);

  return {
    order: castDocument<OrderDoc>(order),
    items: castDocuments<OrderItemDoc>(items.documents),
  };
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderDoc["status"]) {
  const { databases } = createAppwriteServer();

  const updated = await databases.updateDocument(
    databaseId,
    ordersCollectionId,
    orderId,
    { status }
  );

  return { ok: true, order: updated };
}

/**
 * Delete order and its items
 */
export async function deleteOrder(orderId: string) {
  const { databases } = createAppwriteServer();

  // First, delete all related items
  const items = await listItemsForOrder(orderId);

  for (const item of items.documents) {
    await databases.deleteDocument(databaseId, orderItemsCollectionId, item.$id);
  }

  // Then delete the order
  await databases.deleteDocument(databaseId, ordersCollectionId, orderId);

  return { ok: true };
}

/**
 * Get order statistics
 */
export async function getOrderStats() {
  const { databases } = createAppwriteServer();

  const allOrders = await databases.listDocuments(
    databaseId,
    ordersCollectionId,
    [Query.limit(1000)]
  );

  const orders = allOrders.documents;

  const stats = {
    total: orders.length,
    ordered: orders.filter((o) => o.status === "ordered").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    delivering: orders.filter((o) => o.status === "delivering").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0),
    todayOrders: orders.filter((o) => {
      const today = new Date().toISOString().split("T")[0];
      return o.$createdAt.startsWith(today);
    }).length,
  };

  return stats;
}
