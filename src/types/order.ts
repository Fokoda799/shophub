export type OrderStatus = "ordered" | "confirmed" | "processing" | "delivering" | "delivered" | "cancelled";

export type Order = OrderDoc & {
  items?: OrderItemDoc[];
};

export type OrderDoc = {
  $id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode: string;
  totalAmount: number;
  notes?: string;
  ipAddress: string;
  userAgent: string;
  sourceCountry: string;
  status: OrderStatus;
  $createdAt: string;
  $updatedAt: string;
}

export type OrderItemInput = {
  title: string;
  quantity: number; 
};
 
export type OrderItemDoc = OrderItemInput & {
  $id: string;
  orderId: string;
  price: number;
}

