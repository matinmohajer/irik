"use client";

import { useEffect } from "react";
import { vazirmatn } from "@/fonts";
import "./globals.css";

// This replaces the entire root layout when the layout itself throws (e.g. the
// WooCommerce category fetch that feeds the mega menu) — SiteHeader/SiteFooter
// depend on that same data, so this can't reuse them and renders standalone,
// but it still pulls in the site's own font and design tokens for visual continuity.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>
        <div className="container section-tight">
          <div className="empty-state">
            <h1 className="disp" style={{ fontSize: "1.4rem" }}>
              سایت موقتاً در دسترس نیست
            </h1>
            <p>مشکلی در ارتباط با سرور پیش آمده. لطفاً کمی بعد دوباره تلاش کنید.</p>
            <button type="button" className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => reset()}>
              تلاش دوباره
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
