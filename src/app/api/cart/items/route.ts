import { NextResponse } from "next/server";
import { storeApiFetch, StoreApiError } from "@/lib/store-api/client";
import { mapCart } from "@/lib/store-api/map";
import { getStoreApiCredentials, persistStoreApiCredentials } from "@/lib/store-api/session";
import type { StoreCart } from "@/lib/store-api/types";

export async function POST(request: Request) {
  const { productId, quantity } = await request.json();

  if (!Number.isInteger(productId)) {
    return NextResponse.json({ message: "شناسه محصول نامعتبر است." }, { status: 400 });
  }

  try {
    const credentials = await getStoreApiCredentials();
    const { data, cartToken, nonce } = await storeApiFetch<StoreCart>("/cart/add-item", {
      method: "POST",
      body: JSON.stringify({ id: productId, quantity: quantity ?? 1 }),
      storeCredentials: credentials,
    });

    const response = NextResponse.json(mapCart(data));
    persistStoreApiCredentials(response, cartToken, nonce);
    return response;
  } catch (err) {
    if (err instanceof StoreApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "افزودن محصول به سبد خرید ناموفق بود." }, { status: 502 });
  }
}
