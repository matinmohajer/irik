import { NextResponse } from "next/server";
import { storeApiFetch, StoreApiError } from "@/lib/store-api/client";
import { parseAddressInput } from "@/lib/store-api/address";
import { mapCart } from "@/lib/store-api/map";
import { getStoreApiCredentials, persistStoreApiCredentials } from "@/lib/store-api/session";
import type { StoreCart } from "@/lib/store-api/types";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseAddressInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }

  try {
    const credentials = await getStoreApiCredentials();
    const { data, cartToken, nonce } = await storeApiFetch<StoreCart>("/cart/update-customer", {
      method: "POST",
      body: JSON.stringify({
        billing_address: parsed.address,
        shipping_address: parsed.address,
      }),
      storeCredentials: credentials,
    });

    const response = NextResponse.json(mapCart(data));
    persistStoreApiCredentials(response, cartToken, nonce);
    return response;
  } catch (err) {
    if (err instanceof StoreApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "ثبت آدرس ناموفق بود." }, { status: 502 });
  }
}
