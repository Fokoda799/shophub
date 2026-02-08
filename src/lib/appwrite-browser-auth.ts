const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

function getBaseUrl() {
  return endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint;
}

async function requestAppwrite(path: string, init?: RequestInit) {
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

export async function createEmailPasswordSession(email: string, password: string) {
  return requestAppwrite("/account/sessions/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentAccount() {
  return requestAppwrite("/account", { method: "GET" });
}

export async function deleteCurrentSession() {
  return requestAppwrite("/account/sessions/current", { method: "DELETE" });
}
