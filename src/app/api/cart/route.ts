import { NextResponse } from "next/server";
import { storeApiFetch, StoreApiError } from "@/lib/store-api/client";
import { mapCart } from "@/lib/store-api/map";
import { getStoreApiCredentials, persistStoreApiCredentials } from "@/lib/store-api/session";
import type { StoreCart } from "@/lib/store-api/types";

export async function GET() {
  try {
    const credentials = await getStoreApiCredentials();
    const { data, cartToken, nonce } = await storeApiFetch<StoreCart>("/cart", { storeCredentials: credentials });

    const response = NextResponse.json(mapCart(data));
    persistStoreApiCredentials(response, cartToken, nonce);
    return response;
  } catch (err) {
    if (err instanceof StoreApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "خطا در دریافت سبد خرید." }, { status: 502 });
  }
}
