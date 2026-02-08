export type Product = {
  $id: string;
  title: string;
  price: number;
  description?: string;
  imageFileIds?: string[];
};

export type ProductDoc = Product & {
  $createdAt: string;
  $updatedAt: string;
}

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string | null;
}

export type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
};
