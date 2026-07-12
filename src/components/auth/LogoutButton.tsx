"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icons/Icon";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={logout} disabled={loading}>
      <Icon name="x" className="icon icon-sm" />
      {loading ? "در حال خروج…" : "خروج از حساب"}
    </button>
  );
}
