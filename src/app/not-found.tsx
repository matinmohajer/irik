import Link from "next/link";
import { Icon } from "@/components/icons/Icon";

export default function NotFound() {
  return (
    <div className="container section-tight">
      <div className="empty-state">
        <Icon name="search" className="icon icon-lg" style={{ margin: "0 auto 16px", color: "var(--ink-faint)" }} />
        <h2>این صفحه پیدا نشد</h2>
        <p>ممکن است آدرس اشتباه باشد یا صفحه جابه‌جا شده باشد.</p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: 20 }}>
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
