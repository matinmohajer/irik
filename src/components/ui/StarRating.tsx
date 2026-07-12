import { Icon } from "@/components/icons/Icon";

export function StarRating({ rating, className = "icon" }: { rating: number; className?: string }) {
  const filled = Math.round(rating);
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name={i < filled ? "star" : "star-o"} className={className} />
      ))}
    </span>
  );
}
