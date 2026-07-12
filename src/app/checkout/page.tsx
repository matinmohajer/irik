import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "تکمیل خرید",
};

export default function CheckoutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "سبد خرید", href: "/cart" }, { label: "تکمیل خرید" }]} />
      <div className="container">
        <CheckoutForm />
      </div>
    </>
  );
}
