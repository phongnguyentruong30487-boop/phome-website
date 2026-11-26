import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import SideBox from "@/components/ui/SideBox";
import { getPolicy, policies } from "@/lib/data";
import { BUY_STEPS } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPolicy((await params).slug);
  return p ? { title: p.title } : {};
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <PageShell
      title={policy.title}
      crumbs={[{ label: policy.title }]}
      aside={<SideBox title="Chính sách & hướng dẫn" links={policies.map((p) => ({ href: `/chinh-sach/${p.slug}`, label: p.title, active: p.slug === slug }))} />}
    >
      {slug === "huong-dan" ? (
        // Hướng dẫn cũ mô tả giỏ hàng/tài khoản không còn trên web mới → thay bằng quy trình hiện tại
        <div className="rte">
          <p>Đặt mua sản phẩm tại Nội thất P-Home chỉ với vài bước đơn giản:</p>
          {BUY_STEPS.map((s, k) => (
            <p key={k}>
              <strong>Bước {k + 1}:</strong> {s}
            </p>
          ))}
          <p>Trân trọng cảm ơn.</p>
        </div>
      ) : (
        <div className="rte" dangerouslySetInnerHTML={{ __html: policy.body }} />
      )}
    </PageShell>
  );
}
