import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { PROMISES } from "@/lib/site";
import HeroSlider from "@/components/home/HeroSlider";
import ProductCard, { toCard } from "@/components/product/ProductCard";
import PostCard from "@/components/post/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { categories, hotSale, posts, productsIn } from "@/lib/data";

// Các danh mục hiển thị thành khối riêng ở trang chủ (theo thứ tự)
const HOME_CATEGORIES = ["ke-lo-vi-song-ke-may-giat", "ke-sat-trang-tri", "tu-ao", "tu-bep", "giuong-ngu", "tu-giay", "ke-tivi"];

const BANNERS: Record<string, { src: string; href: string; alt: string }> = {
  "tu-ao": { src: "/images/banner/ke-trang-tri.jpg", href: "/danh-muc/ke-sat-trang-tri", alt: "Kệ trang trí P-Home giá xưởng" },
  "giuong-ngu": { src: "/images/banner/tu-bep.jpg", href: "/danh-muc/tu-bep", alt: "Hệ tủ bếp P-Home" },
};

const ICONS = { ship: Truck, warranty: ShieldCheck, return: RefreshCw, factory: BadgeCheck };

export default function HomePage() {
  const hotList = hotSale(8);
  const hotSlugs = new Set(hotList.map((p) => p.slug));
  const hot = hotList.map(toCard);

  return (
    <>
      {/* Slider */}
      <div className="container-site">
        <HeroSlider />
      </div>

      {/* Cam kết */}
      <div className="container-site mt-6">
        <ul className="grid grid-cols-2 gap-3 border border-line p-3 md:grid-cols-4">
          {PROMISES.map(({ key, title, desc, href }) => {
            const Icon = ICONS[key];
            return (
              <li key={key}>
                <Link href={href} className="group flex items-center gap-3 p-1">
                  <Icon className="h-8 w-8 shrink-0 text-brand" strokeWidth={1.6} />
                  <div>
                    <div className="text-[13px] font-bold uppercase text-ink transition-colors group-hover:text-brand">{title}</div>
                    <div className="text-[12px] text-gray-500">{desc}</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sản phẩm hot sale */}
      <section className="container-site mt-12">
        <Reveal>
          <SectionHeading title="Sản phẩm hot sale" pill="Sản phẩm hot sale" />
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
          {hot.map((p, k) => (
            <RevealItem key={p.slug}>
              <ProductCard p={p} priority={k < 4} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Mỗi danh mục một khối */}
      {HOME_CATEGORIES.map((slug) => {
        const cat = categories.find((c) => c.slug === slug);
        // không lặp lại sản phẩm đã có ở khối hot sale
        const items = productsIn(slug).filter((p) => !hotSlugs.has(p.slug)).slice(0, 8).map(toCard);
        if (!cat || !items.length) return null;
        const banner = BANNERS[slug];
        return (
          <div key={slug}>
            <section className="container-site mt-12">
              <Reveal>
                <SectionHeading title={cat.name} pill="Xem tất cả" href={`/danh-muc/${slug}`} />
              </Reveal>
              <RevealGroup className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
                {items.map((p, k) => (
                  <RevealItem key={p.slug} className={k >= 6 ? "hidden lg:block" : k >= 4 ? "max-md:hidden" : undefined}>
                    <ProductCard p={p} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>
            {banner && (
              <Reveal className="container-site mt-12">
                <Link href={banner.href} className="relative block aspect-[1200/350] overflow-hidden">
                  <Image src={banner.src} alt={banner.alt} fill sizes="(max-width: 1065px) 100vw, 1035px" className="object-cover transition-transform duration-700 hover:scale-[1.02]" />
                </Link>
              </Reveal>
            )}
          </div>
        );
      })}

      {/* Tin tức */}
      <section className="container-site mb-14 mt-14">
        <Reveal>
          <SectionHeading title="Tin tức" pill="Tư vấn thiết kế" href="/tin-tuc" />
        </Reveal>
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.slice(0, 4).map((post) => (
            <RevealItem key={post.slug}>
              <PostCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
