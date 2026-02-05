import { Client, Databases, Storage } from "node-appwrite";

function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  if (value.startsWith("replace-with-")) {
    throw new Error(`Invalid placeholder value for env var: ${key}`);
  }
  return value;
}

export function createAppwriteServer() {
  const endpoint = requiredEnv("APPWRITE_ENDPOINT");
  const projectId = requiredEnv("APPWRITE_PROJECT_ID");
  const apiKey = requiredEnv("APPWRITE_API_KEY");

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return {
    databases: new Databases(client),
    storage: new Storage(client),
  };
}
