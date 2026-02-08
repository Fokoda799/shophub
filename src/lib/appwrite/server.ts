import { Client, Databases, Storage } from "node-appwrite";

import { appwriteConfig } from "./config";

const { endpoint, projectId, apiKey } = appwriteConfig;


/**
 * Creates and configures an Appwrite client for server-side use.
 * 
 */
export function createAppwriteServer() {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return {
    databases: new Databases(client),
    storage: new Storage(client),
  };
}

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