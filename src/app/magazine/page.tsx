import type { Metadata } from "next";
import Image from "next/image";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Icon } from "@/components/icons/Icon";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { getPosts } from "@/lib/data";
import { formatJalaliDate, toPersianDigits } from "@/lib/format";
import { isSvgPath } from "@/lib/image";

export const metadata: Metadata = {
  title: "مجله آیریک",
  description: "راهنمای خرید، مقایسه محصولات و اخبار دنیای سخت‌افزار — به‌قلم کارشناسان فروشگاه آیریک.",
};

const CATEGORY_CHIPS = [
  { slug: "buying-guide", label: "راهنمای خرید" },
  { slug: "comparison", label: "مقایسه" },
  { slug: "tutorial", label: "آموزش" },
  { slug: "news", label: "اخبار" },
];

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function MagazinePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const category = sp.category;
  const page = sp.page ? Math.max(1, Number(sp.page)) : 1;

  const result = await getPosts(page, category);
  const [featured, ...rest] = result.posts;

  function buildHref(overrides: { category?: string; clearCategory?: boolean; page?: number }): string {
    const q = new URLSearchParams();
    const nextCategory = overrides.clearCategory ? undefined : (overrides.category ?? category);
    if (nextCategory) q.set("category", nextCategory);
    const nextPage = overrides.page ?? 1;
    if (nextPage > 1) q.set("page", String(nextPage));
    const qs = q.toString();
    return `/magazine${qs ? `?${qs}` : ""}`;
  }

  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "مجله آیریک" }]} />

      <div className="container mag-hero">
        <span className="eyebrow">مجله آیریک</span>
        <h1>
          راهنمای خرید، مقایسه محصولات
          <br />و اخبار دنیای سخت‌افزار
        </h1>
        <p>مطالبی که کارشناسان آیریک پیش از هر خرید، برایتان می‌نویسند — بدون تعارف و مستقیم سر اصل مطلب.</p>
      </div>

      {featured && page === 1 && !category && (
        <div className="container section-tight">
          <article className="featured-article">
            <div className="article-media">
              <span className="badge badge-accent article-tag">{featured.categoryLabel}</span>
              {featured.image ? (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1080px) 100vw, 600px"
                  style={{ objectFit: "cover" }}
                  unoptimized={isSvgPath(featured.image)}
                />
              ) : (
                <Icon name={featured.icon} />
              )}
            </div>
            <div className="article-body">
              <p className="article-meta">
                {formatJalaliDate(featured.dateIso)} · {toPersianDigits(featured.readMinutes)} دقیقه مطالعه
              </p>
              <h2 className="article-title">
                <a href={`/magazine/${featured.slug}`}>{featured.title}</a>
              </h2>
              <p className="article-excerpt">{featured.excerpt}</p>
              <a href={`/magazine/${featured.slug}`} className="btn btn-ghost btn-sm" style={{ width: "fit-content", marginTop: 18 }}>
                ادامه مطلب
              </a>
            </div>
          </article>
        </div>
      )}

      <div className="container">
        <div className="mag-filters">
          <div className="pill-tabs">
            <a href={buildHref({ clearCategory: true, page: 1 })} className={!category ? "is-active" : undefined}>
              همه
            </a>
            {CATEGORY_CHIPS.map((chip) => (
              <a key={chip.slug} href={buildHref({ category: chip.slug, page: 1 })} className={category === chip.slug ? "is-active" : undefined}>
                {chip.label}
              </a>
            ))}
          </div>
        </div>

        {result.posts.length > 0 ? (
          <div className="article-grid" style={{ paddingBottom: 56 }}>
            {(page === 1 && !category ? rest : result.posts).map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>مطلبی یافت نشد</h2>
            <p>در این دسته هنوز مطلبی منتشر نشده است.</p>
          </div>
        )}

        <Pagination page={result.page} totalPages={result.totalPages} buildHref={(p) => buildHref({ page: p })} />
      </div>
    </>
  );
}
