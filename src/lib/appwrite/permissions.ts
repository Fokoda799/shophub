import { Permission, Role } from "node-appwrite";


/**
 * Returns an array of permissions that allow public read access.
 * @returns An array of Appwrite permissions.
 */
export function publicReadPermissions() {
  return [Permission.read(Role.any())];
}

