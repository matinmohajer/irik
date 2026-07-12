"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/lib/site-config";
import type { CategoryNode } from "@/lib/types";

/**
 * Hamburger + slide-in drawer for narrow viewports, where .main-nav (the
 * mega menu) is hidden. Built on native <dialog> via showModal() so we get
 * real modal semantics for free: Escape-to-close, focus trapping, and
 * top-layer rendering — which sidesteps the site header's backdrop-filter
 * creating a containing block that would otherwise break a hand-rolled
 * position:fixed overlay nested inside it.
 */
export function MobileNav({ tree }: { tree: CategoryNode[] }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  function toggleExpanded(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  return (
    <>
      <button
        type="button"
        className="btn-icon mobile-nav-toggle"
        aria-label="باز کردن منو"
        aria-expanded={isOpen}
        onClick={() => {
          dialogRef.current?.showModal();
          setIsOpen(true);
        }}
      >
        <Icon name="menu" />
      </button>

      <dialog
        ref={dialogRef}
        className="mobile-drawer"
        aria-label="منوی دسته‌بندی محصولات"
        onClose={() => setIsOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="mobile-drawer-panel">
          <div className="mobile-drawer-head">
            <Logo />
            <button type="button" className="btn-icon" aria-label="بستن منو" onClick={() => dialogRef.current?.close()}>
              <Icon name="x" />
            </button>
          </div>

          <nav aria-label="دسته‌بندی محصولات" className="mobile-drawer-nav">
            <ul>
              {tree.map((category) => {
                const isExpanded = expanded.has(category.slug);
                const subId = `mobile-sub-${category.slug}`;
                return (
                  <li key={category.slug} className="mobile-accordion-item">
                    <div className="mobile-accordion-row">
                      <Link href={`/products/${category.slug}`}>
                        <Icon name={category.icon} className="icon icon-sm" />
                        {category.name}
                      </Link>
                      {category.children.length > 0 && (
                        <button
                          type="button"
                          className="mobile-accordion-toggle"
                          aria-expanded={isExpanded}
                          aria-controls={subId}
                          aria-label={`زیردسته‌های ${category.name}`}
                          onClick={() => toggleExpanded(category.slug)}
                        >
                          <Icon name="chev-down" className={`icon icon-sm${isExpanded ? " is-open" : ""}`} />
                        </button>
                      )}
                    </div>
                    {isExpanded && category.children.length > 0 && (
                      <ul id={subId} className="mobile-accordion-children">
                        {category.children.map((child) => (
                          <li key={child.slug}>
                            <Link href={`/products/${child.slug}`}>{child.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              <li className="mobile-nav-plain">
                <Link href="/magazine">مجله آیریک</Link>
              </li>
              <li className="mobile-nav-plain">
                <Link href="/about">درباره ما</Link>
              </li>
            </ul>
          </nav>

          <div className="mobile-drawer-foot">
            <a href={siteConfig.phoneHref}>
              <Icon name="phone" className="icon icon-sm" />
              {siteConfig.phoneDisplay}
            </a>
            <p>
              <Icon name="pin" className="icon icon-sm" />
              {siteConfig.address}
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
