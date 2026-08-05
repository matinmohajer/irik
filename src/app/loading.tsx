import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

export default function Loading() {
  return (
    <>
      <div className="container section-tight">
        <div className="cat-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="cat-tile" aria-hidden="true">
              <span className="skeleton" style={{ width: 26, height: 26, borderRadius: "50%" }} />
              <span className="skeleton skeleton-text" style={{ width: "70%", height: 12 }} />
            </div>
          ))}
        </div>
      </div>

      <div className="container section">
        <div className="section-head">
          <div>
            <span className="skeleton skeleton-text" style={{ width: 220, height: 22 }} />
            <span className="skeleton skeleton-text" style={{ width: 280, height: 13, marginTop: 10 }} />
          </div>
        </div>
        <div className="product-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
