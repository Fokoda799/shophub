import { NextResponse } from "next/server";
import { listProductsAction } from "@/actions/admin/products";

export async function GET() {
  try {
    const products = await listProductsAction();
    return NextResponse.json({ ok: true, products });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list products";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

