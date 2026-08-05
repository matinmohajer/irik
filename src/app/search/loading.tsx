import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="container">
      <div className="listing-head">
        <span className="skeleton skeleton-text" style={{ width: 240, height: 27 }} />
      </div>

      <div className="product-grid" style={{ paddingBottom: 56 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
