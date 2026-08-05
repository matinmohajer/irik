export default function Loading() {
  return (
    <div className="container">
      <div className="pdp-layout">
        <div className="bracket">
          <div className="gallery-main skeleton" />
        </div>

        <div className="pdp-info">
          <span className="skeleton skeleton-text" style={{ width: 130, height: 12 }} />
          <span className="skeleton skeleton-text" style={{ width: "85%", height: 26, marginTop: 12 }} />
          <span className="skeleton skeleton-text" style={{ width: "60%", height: 26 }} />
          <span className="skeleton skeleton-text" style={{ width: 170, height: 30, marginTop: 18 }} />
          <span className="skeleton skeleton-text" style={{ width: "100%", height: 44, marginTop: 22, borderRadius: 6 }} />
          <span className="skeleton skeleton-text" style={{ width: "100%", height: 80, marginTop: 22, borderRadius: 6 }} />
        </div>
      </div>

      <div className="section-tight">
        <span className="skeleton skeleton-text" style={{ width: "100%", height: 140, borderRadius: 6 }} />
      </div>
    </div>
  );
}
