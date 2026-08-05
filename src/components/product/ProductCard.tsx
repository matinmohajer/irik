import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Icon } from "@/components/icons/Icon";
import { discountPercent, formatPercent, formatToman } from "@/lib/format";
import { isSvgPath } from "@/lib/image";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const href = `/product/${product.slug}`;
  const onSale = product.regularPrice && product.regularPrice > product.price;
  const image = product.images[0];

  return (
    <article className="card">
      <div className="card-media">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
            unoptimized={isSvgPath(image)}
          />
        ) : (
          <Icon name={product.icon} />
        )}
        <div className="card-badges">
          {onSale && <span className="badge badge-sale">{formatPercent(discountPercent(product.regularPrice!, product.price))} تخفیف</span>}
          {product.isNew && <span className="badge badge-new">جدید</span>}
          {product.isBestSeller && <span className="badge badge-accent">پرفروش</span>}
        </div>
        <button type="button" className="card-fav" aria-label="افزودن به علاقه‌مندی‌ها">
          <Icon name="heart" className="icon" />
        </button>
      </div>
      <div className="card-body">
        {product.brand && <span className="card-brand">{product.brand}</span>}
        <h3 className="card-title">
          <Link href={href} className="card-link-overlay">
            {product.name}
          </Link>
        </h3>
        {product.specChips.length > 0 && (
          <div className="card-specs">
            {product.specChips.map((spec) => (
              <span key={spec} className="chip">
                {spec}
              </span>
            ))}
          </div>
        )}
        <span className={`stock${product.inStock ? "" : " out"}`}>{product.inStock ? "موجود در انبار" : "اتمام موجودی"}</span>
        <div className="card-foot">
          <div className="price-wrap">
            {onSale && <span className="price price-was">{formatToman(product.regularPrice!)}</span>}
            <span className="price price-now">{formatToman(product.price)}</span>
          </div>
          <AddToCartButton productId={Number(product.id)} disabled={!product.inStock} />
        </div>
      </div>
    </article>
  );
}
