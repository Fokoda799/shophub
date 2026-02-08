import { CartItem } from "@/types/product";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  const items: CartItem[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("cart_item_")) continue;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      items.push(JSON.parse(raw) as CartItem);
    } catch {
      // Ignore invalid cart entries.
    }
  }
  return items;
}

