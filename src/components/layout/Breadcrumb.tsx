import Link from "next/link";
import { Icon } from "@/components/icons/Icon";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="breadcrumb">
      <div className="container">
        <ol>
          {items.map((item, i) => (
            <li key={i}>
              {item.href ? <Link href={item.href}>{item.label}</Link> : <span className="current">{item.label}</span>}
              {i < items.length - 1 && <Icon name="chev-start" className="icon" />}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
