export function ProductCardSkeleton() {
  return (
    <div className="card" aria-hidden="true">
      <div className="card-media skeleton" />
      <div className="card-body">
        <span className="skeleton skeleton-text" style={{ width: "35%", height: 10 }} />
        <span className="skeleton skeleton-text" style={{ width: "100%", height: 13, marginTop: 2 }} />
        <span className="skeleton skeleton-text" style={{ width: "65%", height: 13 }} />
        <div className="card-specs">
          <span className="skeleton skeleton-text" style={{ width: 52, height: 20, borderRadius: 999 }} />
          <span className="skeleton skeleton-text" style={{ width: 40, height: 20, borderRadius: 999 }} />
        </div>
        <div className="card-foot">
          <span className="skeleton skeleton-text" style={{ width: 74, height: 18 }} />
          <span className="skeleton" style={{ width: 34, height: 34, borderRadius: "50%" }} />
        </div>
      </div>
    </div>
  );
}
