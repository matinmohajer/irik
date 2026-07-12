"use client";

import Image from "next/image";
import { useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Icon } from "@/components/icons/Icon";
import { StarRating } from "@/components/ui/StarRating";
import { discountPercent, formatPercent, formatToman, toPersianDigits } from "@/lib/format";
import { isSvgPath } from "@/lib/image";
import type { Product } from "@/lib/types";

type Tab = "desc" | "specs" | "reviews";

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [variants, setVariants] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.variants ?? []).map((g) => [g.label, g.options[0]]))
  );
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>("desc");

  const onSale = product.regularPrice && product.regularPrice > product.price;
  const images = product.images.length > 0 ? product.images : [null];

  return (
    <>
      <div className="pdp-layout">
        <div className="bracket">
          <div className="gallery-main">
            {images[activeImage] ? (
              <Image
                src={images[activeImage]!}
                alt={product.name}
                fill
                sizes="(max-width: 1080px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                unoptimized={isSvgPath(images[activeImage]!)}
              />
            ) : (
              <Icon name={product.icon} />
            )}
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((src, i) => (
                <button key={i} type="button" className={i === activeImage ? "is-active" : undefined} onClick={() => setActiveImage(i)}>
                  {src ? (
                    <Image src={src} alt="" width={70} height={70} style={{ objectFit: "cover" }} unoptimized={isSvgPath(src)} />
                  ) : (
                    <Icon name={product.icon} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          {product.sku && (
            <span className="tag-mono">
              {product.brand} · {product.sku}
            </span>
          )}
          <h1>{product.name}</h1>
          <div className="pdp-meta">
            {product.rating !== undefined && (
              <div className="rating">
                <StarRating rating={product.rating} className="icon icon-sm" />
                {toPersianDigits(product.rating.toFixed(1))} از ۵ ( {toPersianDigits(product.reviewCount ?? 0)} نظر )
              </div>
            )}
          </div>

          <div className="price-block">
            <div className="price-wrap">
              {onSale && <span className="price price-was">{formatToman(product.regularPrice!)}</span>}
              <span className="price price-now">{formatToman(product.price)}</span>
            </div>
            {onSale && (
              <span className="discount-badge">
                {formatPercent(discountPercent(product.regularPrice!, product.price))} تخفیف
              </span>
            )}
          </div>

          {product.variants?.map((group) => (
            <div className="variant-group" key={group.label}>
              <h6>{group.label}</h6>
              <div className="variant-options">
                {group.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={variants[group.label] === option ? "is-active" : undefined}
                    onClick={() => setVariants((v) => ({ ...v, [group.label]: option }))}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="buy-row">
            <div className="stepper">
              <button type="button" aria-label="کاهش تعداد" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Icon name="minus" className="icon icon-sm" />
              </button>
              <span>{toPersianDigits(quantity)}</span>
              <button type="button" aria-label="افزایش تعداد" onClick={() => setQuantity((q) => q + 1)}>
                <Icon name="plus" className="icon icon-sm" />
              </button>
            </div>
            <AddToCartButton productId={Number(product.id)} quantity={quantity} disabled={!product.inStock} variant="full" />
            <button type="button" className="btn-icon" style={{ border: "1px solid var(--line)", borderRadius: "var(--radius-md)", width: 44, height: 44 }} aria-label="افزودن به علاقه‌مندی">
              <Icon name="heart" />
            </button>
          </div>

          {product.specs && product.specs.length > 0 && (
            <ul className="spec-highlights">
              {product.specs.slice(0, 3).map((spec) => (
                <li key={spec.label}>
                  <Icon name="cpu" />
                  {spec.label}
                  <b>{spec.value}</b>
                </li>
              ))}
            </ul>
          )}

          <ul className="pdp-trust">
            <li>
              <Icon name="shield" />
              ۱۸ ماه گارانتی شرکتی
            </li>
            <li>
              <Icon name="truck" />
              ارسال ۲۴ ساعته در اصفهان
            </li>
            <li>
              <Icon name="headset" />۷ روز ضمانت بازگشت
            </li>
          </ul>
        </div>
      </div>

      <div className="section-tight">
        <div className="tabs-nav">
          <button type="button" className={tab === "desc" ? "is-active" : undefined} onClick={() => setTab("desc")}>
            توضیحات محصول
          </button>
          {product.specs && product.specs.length > 0 && (
            <button type="button" className={tab === "specs" ? "is-active" : undefined} onClick={() => setTab("specs")}>
              مشخصات فنی
            </button>
          )}
          <button type="button" className={tab === "reviews" ? "is-active" : undefined} onClick={() => setTab("reviews")}>
            نظرات کاربران {product.reviewCount ? `(${toPersianDigits(product.reviewCount)})` : ""}
          </button>
        </div>

        {tab === "desc" && (
          <div className="tab-panel is-active">
            {product.descriptionHtml ? (
              <div className="tab-prose" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            ) : (
              <div className="tab-prose">
                <p>{product.shortDescription}</p>
              </div>
            )}
          </div>
        )}

        {tab === "specs" && product.specs && (
          <div className="tab-panel is-active">
            <table className="spec-table">
              <tbody>
                {product.specs.map((spec) => (
                  <tr key={spec.label}>
                    <td>{spec.label}</td>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "reviews" && (
          <div className="tab-panel is-active">
            {product.rating !== undefined ? (
              <div className="review-summary">
                <div className="review-score">
                  <div className="n">{toPersianDigits(product.rating.toFixed(1))}</div>
                  <StarRating rating={product.rating} />
                  <p>از {toPersianDigits(product.reviewCount ?? 0)} نظر</p>
                </div>
              </div>
            ) : (
              <p className="tab-prose">هنوز نظری برای این محصول ثبت نشده است.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
