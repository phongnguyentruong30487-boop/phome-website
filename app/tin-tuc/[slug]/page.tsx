import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import SideBox from "@/components/ui/SideBox";
import { categories, formatDate, getPost, postCover, posts } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, openGraph: { title: p.title, description: p.excerpt, images: [postCover(p)] } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <PageShell
      title={post.title}
      crumbs={[{ href: "/tin-tuc", label: "Tin tức" }, { label: post.title }]}
      aside={
        <>
          <SideBox
            title="Bài viết khác"
            links={posts.map((p) => ({ href: `/tin-tuc/${p.slug}`, label: p.title, active: p.slug === slug }))}
          />
          <SideBox title="Danh mục sản phẩm" links={categories.map((c) => ({ href: `/danh-muc/${c.slug}`, label: c.name }))} />
        </>
      }
    >
      {post.date && (
        <p className="-mt-2 mb-4 flex items-center gap-1.5 text-[13px] text-gray-500">
          <Calendar className="h-4 w-4" /> {formatDate(post.date)}
        </p>
      )}
      <article className="rte" dangerouslySetInnerHTML={{ __html: post.body }} />
    </PageShell>
  );
}
