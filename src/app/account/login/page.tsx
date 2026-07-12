import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری",
};

export default function LoginPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "ورود" }]} />
      <div className="container section-tight">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
