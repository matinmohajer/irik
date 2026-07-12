import { NextResponse } from "next/server";
import { storeApiFetch, StoreApiError } from "@/lib/store-api/client";
import { mapCart } from "@/lib/store-api/map";
import { getStoreApiCredentials, persistStoreApiCredentials } from "@/lib/store-api/session";
import type { StoreCart } from "@/lib/store-api/types";

interface RouteContext {
  params: Promise<{ key: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { key } = await params;
  const { quantity } = await request.json();

  if (!Number.isInteger(quantity) || quantity < 0) {
    return NextResponse.json({ message: "تعداد نامعتبر است." }, { status: 400 });
  }

  try {
    const credentials = await getStoreApiCredentials();
    const { data, cartToken, nonce } = await storeApiFetch<StoreCart>("/cart/update-item", {
      method: "POST",
      body: JSON.stringify({ key, quantity }),
      storeCredentials: credentials,
    });

    const response = NextResponse.json(mapCart(data));
    persistStoreApiCredentials(response, cartToken, nonce);
    return response;
  } catch (err) {
    if (err instanceof StoreApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "بروزرسانی سبد خرید ناموفق بود." }, { status: 502 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { key } = await params;

  try {
    const credentials = await getStoreApiCredentials();
    const { data, cartToken, nonce } = await storeApiFetch<StoreCart>("/cart/remove-item", {
      method: "POST",
      body: JSON.stringify({ key }),
      storeCredentials: credentials,
    });

    const response = NextResponse.json(mapCart(data));
    persistStoreApiCredentials(response, cartToken, nonce);
    return response;
  } catch (err) {
    if (err instanceof StoreApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "حذف از سبد خرید ناموفق بود." }, { status: 502 });
  }
}
