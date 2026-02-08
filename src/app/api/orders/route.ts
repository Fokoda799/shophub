import { NextResponse } from "next/server";
import { createOrder } from "@/lib/order";

const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

type EmailOrderItem = {
  title?: string;
  price?: number;
  quantity?: number;
};

type EmailOrderPayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
  orderDate?: string;
  subtotal?: number;
  totalAmount?: number;
  items?: EmailOrderItem[];
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formData = new FormData();

    const fields = [
      "fullName",
      "phone",
      "email",
      "address",
      "city",
      "postalCode",
      "notes",
      "totalAmount",
    ];

    for (const field of fields) {
      const value = body?.[field];
      if (value !== undefined && value !== null) {
        formData.set(field, String(value));
      }
    }

    formData.set("items", JSON.stringify(body?.items ?? []));

    const result = await createOrder(formData, request.headers);

    await sendEmailNotification(body);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create order API failed:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

async function sendEmailNotification(order: EmailOrderPayload) {
  try {
    const items = Array.isArray(order?.items) ? order.items : [];
    const subtotal =
      typeof order.subtotal === "number"
        ? order.subtotal
        : items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
    const totalAmount =
      typeof order.totalAmount === "number" ? order.totalAmount : subtotal;

    // Format items list
    const itemsList = items.map((item) =>
      `${item.title ?? "Item"} x${item.quantity ?? 0} - ${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)} MAD`
    ).join('\n');

    // Prepare email data
    const emailData = {
      order_id: `ORD-${Date.now()}`,
      order_date: order.orderDate ? new Date(order.orderDate).toLocaleString() : new Date().toLocaleString(),
      customer_name: order.fullName ?? "Unknown",
      customer_email: order.email || 'Not provided',
      customer_phone: order.phone ?? "Not provided",
      customer_address: `${order.address ?? ""}, ${order.city ?? ""}, ${order.postalCode ?? ""}`,
      product_name: itemsList,
      quantity: items.reduce((sum, item) => sum + (item.quantity ?? 0), 0).toString(),
      price: subtotal.toFixed(2),
      total: totalAmount.toFixed(2),
      notes: order.notes || 'No notes'
    };

    // Send to Google Apps Script
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      console.error("Email notification request failed:", response.status, response.statusText);
      return;
    }

    console.log('Email notification sent successfully');
  } catch (error) {
    // Don't fail the order if email fails
    console.error('Failed to send email notification:', error);
  }
}
