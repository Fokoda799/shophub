import { cookies } from "next/headers";

const adminCookieKey = process.env.ADMIN_COOKIE_KEY || "admin_session";

/**
 * Sets the admin session cookie with the given value.
 * @param value The value to set for the admin session cookie.
 * @returns A promise that resolves when the cookie is set.
 * @throws Error if the cookie cannot be set.
 */
export async function setAdminSession(value: string) {
  const jar = await cookies();
  jar.set(adminCookieKey, value, { httpOnly: true, sameSite: "lax", path: "/" });
}

/**
 * Clears the admin session cookie.
 * @returns A promise that resolves when the cookie is cleared.
 * @throws Error if the cookie cannot be cleared.
 */
export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(adminCookieKey);
}

/**
 * Retrieves the value of the admin session cookie.
 * @returns A promise that resolves to the value of the admin session cookie, or null if not set.
 * @throws Error if the cookie cannot be retrieved.
 */
export async function getAdminSession() {
  const jar = await cookies();
  return jar.get(adminCookieKey)?.value ?? null;
}

