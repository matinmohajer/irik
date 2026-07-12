import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/CartProvider";
import { IconSprite } from "@/components/icons/IconSprite";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { vazirmatn } from "@/fonts";
import { getCategoryTree } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | فروشگاه تخصصی لپ‌تاپ، کامپیوتر و کنسول بازی`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categoryTree = await getCategoryTree();

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>
        <IconSprite />
        <CartProvider>
          <TopBar />
          <SiteHeader categoryTree={categoryTree} />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
