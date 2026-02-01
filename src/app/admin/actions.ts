"use server";

import { ID, Permission, Role } from "node-appwrite";
import { createAppwriteServer } from "../../lib/appwrite-server";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const productsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

function toPrice(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error("Price must be a valid number");
  return n;
}

async function uploadImages(files: File[]) {
  const { storage } = createAppwriteServer();

  const ids: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const uploaded = await storage.createFile(
      bucketId,
      ID.unique(),
      file,
      [
        // ✅ Public read so product pages can view images (fixes 401)
        Permission.read(Role.any()),
      ]
    );

    ids.push(uploaded.$id);
  }

  return ids;
}

/**
 * CREATE
 */
export async function createProductAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) throw new Error("Title is required");
  if (!priceRaw) throw new Error("Price is required");

  const price = toPrice(priceRaw);

  const files = formData.getAll("images") as File[];
  if (!files || files.length === 0) throw new Error("Upload at least 1 image");

  const imageFileIds = await uploadImages(files);

  const { databases } = createAppwriteServer();
  const doc = await databases.createDocument(
    databaseId,
    productsCollectionId,
    ID.unique(),
    {
      title,
      price,
      description: description || undefined,
      imageFileIds,
    }
  );

  return { ok: true, id: doc.$id };
}

/**
 * UPDATE (fields + optionally images)
 * - You can choose to "append images" or "replace images"
 */
export async function updateProductAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "").trim();
  if (!productId) throw new Error("Missing productId");

  const title = String(formData.get("title") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const mode = String(formData.get("imageMode") ?? "append"); // "append" | "replace"
  const existingImageIdsRaw = String(formData.get("existingImageIds") ?? "[]");

  let existingImageIds: string[] = [];
  try {
    existingImageIds = JSON.parse(existingImageIdsRaw);
    if (!Array.isArray(existingImageIds)) existingImageIds = [];
  } catch {
    existingImageIds = [];
  }

  const files = formData.getAll("images") as File[];
  const newImageIds = files?.length ? await uploadImages(files) : [];

  const finalImageIds =
    mode === "replace"
      ? newImageIds
      : [...existingImageIds, ...newImageIds];

  const { databases } = createAppwriteServer();
  const updated = await databases.updateDocument(
    databaseId,
    productsCollectionId,
    productId,
    {
      title,
      price: toPrice(priceRaw),
      description: description || undefined,
      imageFileIds: finalImageIds,
    }
  );

  return { ok: true, id: updated.$id };
}

/**
 * DELETE product
 * Optional: also delete images from storage
 */
export async function deleteProductAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "").trim();
  const deleteImages = String(formData.get("deleteImages") ?? "no") === "yes";
  const imageIdsRaw = String(formData.get("imageIds") ?? "[]");

  if (!productId) throw new Error("Missing productId");

  let imageIds: string[] = [];
  try {
    imageIds = JSON.parse(imageIdsRaw);
    if (!Array.isArray(imageIds)) imageIds = [];
  } catch {
    imageIds = [];
  }

  const { databases, storage } = createAppwriteServer();

  // 1) delete the document
  await databases.deleteDocument(databaseId, productsCollectionId, productId);

  // 2) optionally delete images too
  if (deleteImages && imageIds.length) {
    await Promise.allSettled(
      imageIds.map((id) => storage.deleteFile(bucketId, id))
    );
  }

  return { ok: true };
}
