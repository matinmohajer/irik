import { NextResponse } from "next/server";
import { storeApiFetch, StoreApiError } from "@/lib/store-api/client";
import { parseAddressInput } from "@/lib/store-api/address";
import { getStoreApiCredentials, persistStoreApiCredentials } from "@/lib/store-api/session";
import type { CheckoutResult } from "@/lib/store-api/types";

/** ZarinPal Gateway plugin's WooCommerce gateway ID — see irik-wp/wp-content/plugins/zarinpal-woocommerce-payment-gateway. */
const PAYMENT_METHOD = "WC_ZPal";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseAddressInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }

  try {
    const credentials = await getStoreApiCredentials();
    const { data, cartToken, nonce } = await storeApiFetch<CheckoutResult>("/checkout", {
      method: "POST",
      body: JSON.stringify({
        billing_address: parsed.address,
        shipping_address: parsed.address,
        payment_method: PAYMENT_METHOD,
      }),
      storeCredentials: credentials,
    });

    const response = NextResponse.json({
      orderId: data.order_id,
      orderKey: data.order_key,
      redirectUrl: data.payment_result.redirect_url,
    });
    persistStoreApiCredentials(response, cartToken, nonce);
    return response;
  } catch (err) {
    if (err instanceof StoreApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "ثبت سفارش ناموفق بود." }, { status: 502 });
  }
}
