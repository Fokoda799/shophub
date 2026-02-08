import { createAppwriteServer } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";

import { ProductDoc } from "@/types/product";
import { castDocument, castDocuments } from "@/types/cast";

const { databaseId, productsCollectionId } = appwriteConfig;
const { databases } = createAppwriteServer();


export async function listProducts() {
  const res = await databases.listDocuments(databaseId, productsCollectionId);
  return castDocuments<ProductDoc>(res.documents);
}

export async function getProductById(id: string) {
  const res = await databases.getDocument(databaseId, productsCollectionId, id);
  return castDocument<ProductDoc>(res);
}