import type { StoreAddress } from "@/lib/store-api/types";

export interface AddressInput {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email?: string;
}

/** Validates and maps the frontend's camelCase address form to the Store API's shape. Returns an error message instead of throwing, since this is meant to be checked inline in a Route Handler. */
export function parseAddressInput(body: unknown): { address: StoreAddress } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "اطلاعات آدرس نامعتبر است." };
  const b = body as Partial<AddressInput>;

  const required: (keyof AddressInput)[] = ["firstName", "lastName", "address1", "city", "state", "postcode", "phone"];
  for (const field of required) {
    if (!b[field] || typeof b[field] !== "string" || !b[field]!.trim()) {
      return { error: "لطفاً همه فیلدهای آدرس را تکمیل کنید." };
    }
  }

  return {
    address: {
      first_name: b.firstName!.trim(),
      last_name: b.lastName!.trim(),
      address_1: b.address1!.trim(),
      city: b.city!.trim(),
      state: b.state!.trim(),
      postcode: b.postcode!.trim(),
      country: "IR",
      phone: b.phone!.trim(),
      email: b.email?.trim() || undefined,
    },
  };
}
