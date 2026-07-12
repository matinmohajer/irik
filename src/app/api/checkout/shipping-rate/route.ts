import { NextResponse } from "next/server";
import { storeApiFetch, StoreApiError } from "@/lib/store-api/client";
import { mapCart } from "@/lib/store-api/map";
import { getStoreApiCredentials, persistStoreApiCredentials } from "@/lib/store-api/session";
import type { StoreCart } from "@/lib/store-api/types";

export async function POST(request: Request) {
  const { rateId } = await request.json();
  if (typeof rateId !== "string" || !rateId) {
    return NextResponse.json({ message: "روش ارسال نامعتبر است." }, { status: 400 });
  }

  try {
    const credentials = await getStoreApiCredentials();
    const { data, cartToken, nonce } = await storeApiFetch<StoreCart>("/cart/select-shipping-rate", {
      method: "POST",
      // single-package store (one shipping zone, no split shipments) — package_id 0 always
      body: JSON.stringify({ package_id: 0, rate_id: rateId }),
      storeCredentials: credentials,
    });

    const response = NextResponse.json(mapCart(data));
    persistStoreApiCredentials(response, cartToken, nonce);
    return response;
  } catch (err) {
    if (err instanceof StoreApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "انتخاب روش ارسال ناموفق بود." }, { status: 502 });
  }
}
