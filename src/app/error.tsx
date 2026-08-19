"use client";

import { useEffect } from "react";
import { Icon } from "@/components/icons/Icon";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container section-tight">
      <div className="empty-state">
        <Icon name="x" className="icon icon-lg" style={{ margin: "0 auto 16px", color: "var(--danger)" }} />
        <h2>مشکلی پیش آمد</h2>
        <p>در دریافت اطلاعات خطایی رخ داد. لطفاً دوباره تلاش کنید.</p>
        <button type="button" className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => reset()}>
          تلاش دوباره
        </button>
      </div>
    </div>
  );
}
