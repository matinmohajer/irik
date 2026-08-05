import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="container">
      <div className="listing-head">
        <span className="skeleton skeleton-text" style={{ width: 200, height: 27 }} />
        <span className="skeleton skeleton-text" style={{ width: "55%", height: 13, marginTop: 12 }} />
      </div>

      <div className="listing-layout">
        <aside className="filters">
          <div className="filter-group">
            <span className="skeleton skeleton-text" style={{ width: 50, height: 12, marginBottom: 14 }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="skeleton skeleton-text" style={{ width: "100%", height: 13, marginBottom: 11 }} />
            ))}
          </div>
          <div className="filter-group">
            <span className="skeleton skeleton-text" style={{ width: 80, height: 12, marginBottom: 14 }} />
            <span className="skeleton skeleton-text" style={{ width: "100%", height: 26 }} />
          </div>
        </aside>

        <div>
          <div className="toolbar">
            <span className="skeleton skeleton-text" style={{ width: 110, height: 13 }} />
            <span className="skeleton skeleton-text" style={{ width: 170, height: 38, borderRadius: 6 }} />
          </div>
          <div className="product-grid cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
