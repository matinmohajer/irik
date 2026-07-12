import { NextResponse } from "next/server";
import { requestOtp, WpAuthError } from "@/lib/auth/wp-client";

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (typeof phone !== "string" || !phone.trim()) {
    return NextResponse.json({ message: "شماره موبایل الزامی است." }, { status: 400 });
  }

  try {
    const result = await requestOtp(phone);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof WpAuthError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "خطا در ارتباط با سرور. دوباره تلاش کنید." }, { status: 502 });
  }
}
