import { getCartItems } from "./cart.utils";

export function getCartCount() {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
}

