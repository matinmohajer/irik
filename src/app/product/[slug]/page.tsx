import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getCategories, getProductBySlug, getRelatedProducts } from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription ?? product.name,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, related] = await Promise.all([getCategories(), getRelatedProducts(product, 4)]);
  const category = categories.find((c) => c.slug === product.categorySlug);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "آیریک", href: "/" },
          ...(category ? [{ label: category.name, href: `/products/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="container">
        <ProductDetail product={product} />

        {related.length > 0 && (
          <div className="section">
            <div className="section-head">
              <h2 className="section-title">محصولات مشابه</h2>
            </div>
            <div className="related-scroll">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
