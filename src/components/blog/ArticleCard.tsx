import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { formatJalaliDate, toPersianDigits } from "@/lib/format";
import { isSvgPath } from "@/lib/image";
import type { PostSummary } from "@/lib/types";

export function ArticleCard({ post }: { post: PostSummary }) {
  const href = `/magazine/${post.slug}`;

  return (
    <article className="article-card">
      <div className="article-media">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized={isSvgPath(post.image)}
          />
        ) : (
          <Icon name={post.icon} />
        )}
        <span className="badge badge-accent article-tag">{post.categoryLabel}</span>
      </div>
      <div className="article-body">
        <p className="article-meta">
          {formatJalaliDate(post.dateIso)} · {toPersianDigits(post.readMinutes)} دقیقه مطالعه
        </p>
        <h3 className="article-title">
          <Link href={href}>{post.title}</Link>
        </h3>
        <p className="article-excerpt">{post.excerpt}</p>
      </div>
    </article>
  );
}
