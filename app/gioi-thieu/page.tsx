import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { aboutHtml } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Công ty TNHH Trang trí Nội thất P-Home – thành lập năm 2019, cung cấp dịch vụ trọn gói từ sản xuất, thi công đến trang trí nội thất hoàn thiện.",
};

const PROJECTS = [
  { src: "/images/projects/proj2.png", title: "Nội thất văn phòng ACB", cat: "Không gian thương mại" },
  { src: "/images/projects/proj1.png", title: "Thi công nội thất nhà phố", cat: "Tủ áo · Kệ gầm cầu thang" },
  { src: "/images/projects/proj3.png", title: "Phòng khám Flora", cat: "Tủ & kệ trang trí" },
];

export default function AboutPage() {
  return (
    <PageShell title="Giới thiệu" crumbs={[{ label: "Giới thiệu" }]}>
      <div className="rte" dangerouslySetInnerHTML={{ __html: aboutHtml }} />

      <section className="mt-12">
        <SectionHeading title="Công trình tiêu biểu" />
        <RevealGroup className="grid gap-4 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <RevealItem key={p.title} className="group relative aspect-[4/3] overflow-hidden bg-soft">
              <Image src={p.src} alt={p.title} fill sizes="(max-width: 768px) 100vw, 345px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute bottom-0 p-4 text-white">
                <div className="text-[12px] uppercase opacity-80">{p.cat}</div>
                <div className="font-bold">{p.title}</div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <Reveal className="mt-12 flex flex-col items-center gap-4 bg-brand px-6 py-8 text-center text-white md:flex-row md:justify-between md:text-left">
        <div>
          <div className="text-[20px] font-bold uppercase">Cần tư vấn thiết kế &amp; báo giá?</div>
          <div className="mt-1 text-white/85">Gọi {SITE.phoneDisplay} hoặc để lại thông tin, P-Home sẽ liên hệ ngay.</div>
        </div>
        <div className="flex shrink-0 gap-3">
          <a href={`tel:${SITE.phone}`} className="rounded bg-hot px-5 py-2.5 font-bold text-white hover:bg-[#c8161d]">Gọi ngay</a>
          <Link href="/lien-he" className="rounded bg-white px-5 py-2.5 font-bold text-brand hover:bg-white/90">Liên hệ</Link>
        </div>
      </Reveal>
    </PageShell>
  );
}
