import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionView from "@/components/product/CollectionView";
import { categories, getCategory, productsIn } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const cat = getCategory((await params).slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: `${cat.name} P-Home – sản xuất tại xưởng, thiết kế theo yêu cầu, giao hàng & lắp đặt tận nơi tại TP. HCM.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  return <CollectionView title={cat.name} slug={slug} items={productsIn(slug)} />;
}
