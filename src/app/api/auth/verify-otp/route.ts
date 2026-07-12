import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { verifyOtp, WpAuthError } from "@/lib/auth/wp-client";

export async function POST(request: Request) {
  const { phone, code } = await request.json();

  if (typeof phone !== "string" || typeof code !== "string" || !phone.trim() || !code.trim()) {
    return NextResponse.json({ message: "شماره موبایل و کد الزامی است." }, { status: 400 });
  }

  try {
    const { token, user } = await verifyOtp(phone, code);
    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (err) {
    if (err instanceof WpAuthError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "خطا در ارتباط با سرور. دوباره تلاش کنید." }, { status: 502 });
  }
}
