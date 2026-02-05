import { createAppwriteServer } from "./appwrite-server";

const databaseId = process.env.APPWRITE_DATABASE_ID!;
const productsCollectionId = process.env.APPWRITE_PRODUCTS_COLLECTION_ID!;
const bucketId = process.env.APPWRITE_BUCKET_ID!;

export type ProductDoc = {
  $id: string;
  title: string;
  price: number;
  description?: string;
  imageFileIds?: string[];
};

export async function listProducts(): Promise<ProductDoc[]> {
  const { databases } = createAppwriteServer();
  const res = await databases.listDocuments(databaseId, productsCollectionId);
  return res.documents as unknown as ProductDoc[];
}

export async function getProductById(id: string): Promise<ProductDoc> {
  const { databases } = createAppwriteServer();
  const doc = await databases.getDocument(databaseId, productsCollectionId, id);
  return doc as unknown as ProductDoc;
}

export function getAppwriteImageUrl(fileId: string) {
  // Public "view" URL (works if file read permission is public)
  const endpoint = process.env.APPWRITE_ENDPOINT!;
  const projectId = process.env.APPWRITE_PROJECT_ID!;
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}
