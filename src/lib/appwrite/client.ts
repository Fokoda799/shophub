const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;


/**
 * Constructs a public URL for an Appwrite image file.
 * This URL can be used in <img> tags or as CSS backgrounds.
 * Note: The file must have "Public" permissions in Appwrite for this to work.
 * 
 * @param fileId The ID of the Appwrite file.
 * @returns A URL string that can be used to access the image publicly.
 * @throws Error if required Appwrite configuration is missing.
 */
export function getPublicAppwriteImageUrl(fileId: string) {

  if (!endpoint || !projectId || !bucketId) {
    // Helpful for debugging
    throw new Error("Missing NEXT_PUBLIC_APPWRITE_* env vars for image URL.");
  }

  return `${getBaseUrl()}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}


/**
 * Creates a new email/password session in Appwrite.
 * 
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A promise that resolves to the session data.
 * @throws Error if the request fails.
 */
export async function createEmailPasswordSession(email: string, password: string) {
  return requestAppwrite("/account/sessions/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Retrieves the current user's account information.
 * @returns A promise that resolves to the account data.
 * @throws Error if the request fails.
 */
export async function getCurrentAccount() {
  return requestAppwrite("/account", { method: "GET" });
}

/**
 * Deletes the current user's session.
 * @returns A promise that resolves when the session is deleted.
 * @throws Error if the request fails.
 */
export async function deleteCurrentSession() {
  return requestAppwrite("/account/sessions/current", { method: "DELETE" });
}


// Helper function to make requests to Appwrite API
async function requestAppwrite(path: string, init?: RequestInit) {
  if (!endpoint || !projectId) {
    throw new Error("Missing NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID.");
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": projectId,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Appwrite request failed (${response.status})`;
    try {
      const payload = await response.json();
      if (payload?.message) message = payload.message;
    } catch {
      // Ignore parse errors for non-JSON bodies.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

// Ensures the endpoint does not have a trailing slash for consistent URL construction.
function getBaseUrl() {
  return endpoint?.endsWith("/") ? endpoint.slice(0, -1) : endpoint ?? "";
}
