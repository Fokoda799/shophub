import { CartItem } from "@/types/product";


export const CartStorage = {
  getAll(): CartItem[] {
    if (typeof window === "undefined") return [];
    
    const items: CartItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("cart_item_")) {
        const item = localStorage.getItem(key);
        if (!item) continue;
        try {
          const parsed = JSON.parse(item) as Partial<CartItem> & {
            $id?: string;
            imageFileIds?: string[];
          };

          if (typeof parsed.productId === "string") {
            items.push({
              productId: parsed.productId,
              title: String(parsed.title ?? ""),
              price: Number(parsed.price ?? 0),
              quantity: Number(parsed.quantity ?? 1),
              image: typeof parsed.image === "string" ? parsed.image : null,
            });
            continue;
          }

          // Backward compatibility for legacy cart entries.
          if (typeof parsed.$id === "string") {
            items.push({
              productId: parsed.$id,
              title: String(parsed.title ?? ""),
              price: Number(parsed.price ?? 0),
              quantity: Number(parsed.quantity ?? 1),
              image: null,
            });
          }
        } catch {
          // Ignore malformed entries.
        }
      }
    }
    return items;
  },

  add(item: CartItem): void {
    if (typeof window === "undefined") return;
    console.log("Adding to cart:", item);
    localStorage.setItem(`cart_item_${item.productId}`, JSON.stringify(item));
    window.dispatchEvent(new Event("cart:updated"));
  },

  update(productId: string, quantity: number): void {
    if (typeof window === "undefined") return;
    const key = `cart_item_${productId}`;
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      parsed.quantity = quantity;
      localStorage.setItem(key, JSON.stringify(parsed));
      window.dispatchEvent(new Event("cart:updated"));
    }
  },

  remove(productId: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`cart_item_${productId}`);
    window.dispatchEvent(new Event("cart:updated"));
  },

  clear(): void {
    if (typeof window === "undefined") return;
    const keys = Object.keys(localStorage).filter(k => k.startsWith("cart_item_"));
    keys.forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new Event("cart:updated"));
  },

  getCount(): number {
    return this.getAll().reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotal(): number {
    return this.getAll().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};
