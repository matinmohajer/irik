import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getPostBySlug } from "@/lib/data";
import { formatJalaliDate, toPersianDigits } from "@/lib/format";
import { isSvgPath } from "@/lib/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function MagazinePostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Breadcrumb items={[{ label: "آیریک", href: "/" }, { label: "مجله آیریک", href: "/magazine" }, { label: post.title }]} />

      <div className="container section-tight">
        <span className="badge badge-accent" style={{ marginBottom: 14, display: "inline-flex" }}>
          {post.categoryLabel}
        </span>
        <h1 className="disp" style={{ fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)", marginBottom: 14 }}>
          {post.title}
        </h1>
        <p className="article-meta" style={{ fontSize: "0.8rem", marginBottom: 32 }}>
          {formatJalaliDate(post.dateIso)} · {toPersianDigits(post.readMinutes)} دقیقه مطالعه
        </p>

        {post.image && (
          <div className="article-media bracket" style={{ marginBottom: 32, aspectRatio: "16/8", position: "relative" }}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 1080px) 100vw, 800px"
              style={{ objectFit: "cover" }}
              unoptimized={isSvgPath(post.image)}
            />
          </div>
        )}

        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>
    </>
  );
}
