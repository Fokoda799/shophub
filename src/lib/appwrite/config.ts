export const appwriteConfig = {
  apiKey: process.env.APPWRITE_API_KEY!,
  endpoint: process.env.APPWRITE_ENDPOINT!,
  projectId: process.env.APPWRITE_PROJECT_ID!,
  databaseId: process.env.APPWRITE_DATABASE_ID!,
  bucketId: process.env.APPWRITE_BUCKET_ID!,
  ordersCollectionId: process.env.APPWRITE_ORDERS_COLLECTION_ID!,
  orderItemsCollectionId: process.env.APPWRITE_ORDER_ITEMS_COLLECTION_ID!,
  productsCollectionId: process.env.APPWRITE_PRODUCTS_COLLECTION_ID!,
};

