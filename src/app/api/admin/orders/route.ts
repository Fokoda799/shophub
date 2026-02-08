import { NextResponse } from "next/server";
import { listOrders } from "@/actions/admin/orders";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? undefined;
    const orders = await listOrders(status);
    return NextResponse.json({ ok: true, orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list orders";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

