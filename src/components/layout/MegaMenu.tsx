"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import type { CategoryNode } from "@/lib/types";

/**
 * Desktop navigation: a single "محصولات" trigger opens one mega panel
 * listing every category as a column (heading = parent category, links =
 * its subcategories), so the whole catalog is reachable from one place.
 * Follows the ARIA APG disclosure pattern: a plain button with
 * aria-expanded/aria-controls, not role="menu" — this is site navigation
 * (a list of links), not an application menu.
 */
export function MegaMenu({ tree }: { tree: CategoryNode[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // close whenever the route changes — adjusted during render rather than in
  // an effect, per React's guidance on resetting state in response to a prop
  // change (avoids an extra render pass)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };

  // close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function closeAndRefocus() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  const productsCurrent = pathname.startsWith("/products");
  const panelId = "mega-panel-products";

  return (
    <nav className="main-nav" aria-label="منوی اصلی" ref={navRef}>
      <ul className="mega-list">
        <li
          className="mega-item"
          onMouseEnter={() => {
            clearCloseTimer();
            setOpen(true);
          }}
          onMouseLeave={scheduleClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeAndRefocus();
          }}
        >
          <button
            ref={triggerRef}
            type="button"
            className={`mega-trigger${productsCurrent ? " is-current" : ""}`}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            محصولات
            <Icon name="chev-down" className="icon icon-sm mega-chevron" />
          </button>

          {open && (
            <div id={panelId} className="mega-panel">
              <div className="mega-panel-inner">
                <div className="mega-columns">
                  {tree.map((category) => (
                    <div key={category.slug} className="mega-column">
                      <Link href={`/products/${category.slug}`} className="mega-column-title">
                        <Icon name={category.icon} className="icon icon-sm" />
                        {category.name}
                      </Link>
                      <ul>
                        {category.children.map((child) => (
                          <li key={child.slug}>
                            <Link href={`/products/${child.slug}`}>{child.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </li>
        <li className="mega-item mega-item-plain">
          <Link href="/magazine" className={pathname.startsWith("/magazine") ? "is-current" : undefined}>
            مجله آیریک
          </Link>
        </li>
        <li className="mega-item mega-item-plain">
          <Link href="/about" className={pathname === "/about" ? "is-current" : undefined}>
            درباره ما
          </Link>
        </li>
      </ul>
    </nav>
  );
}
