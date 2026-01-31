export function getPublicAppwriteImageUrl(fileId: string) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

  if (!endpoint || !projectId || !bucketId) {
    // Helpful for debugging
    throw new Error("Missing NEXT_PUBLIC Appwrite env vars for image URL.");
  }

  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}
