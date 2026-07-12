import { NextResponse } from "next/server";
import { getOrderByKey, WpAuthError } from "@/lib/auth/wp-client";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const key = new URL(request.url).searchParams.get("key");

  if (!key) {
    return NextResponse.json({ message: "کد پیگیری سفارش الزامی است." }, { status: 400 });
  }

  try {
    const order = await getOrderByKey(id, key);
    return NextResponse.json(order);
  } catch (err) {
    if (err instanceof WpAuthError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "خطا در دریافت سفارش." }, { status: 502 });
  }
}
