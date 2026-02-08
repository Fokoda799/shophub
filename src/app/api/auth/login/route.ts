import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Use Appwrite client login flow for this project." },
    { status: 400 }
  );
}

