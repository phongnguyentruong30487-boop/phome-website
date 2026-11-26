import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import PostCard from "@/components/post/PostCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { posts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tư vấn thiết kế nội thất, kinh nghiệm làm tủ bếp, mẫu giường và bàn học cho bé từ Nội thất P-Home.",
};

export default function NewsPage() {
  return (
    <PageShell title="Tin tức" crumbs={[{ label: "Tin tức" }]}>
      <RevealGroup className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <RevealItem key={p.slug}>
            <PostCard post={p} />
          </RevealItem>
        ))}
      </RevealGroup>
    </PageShell>
  );
}
