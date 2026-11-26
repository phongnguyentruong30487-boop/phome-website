import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Phone, Mail } from "lucide-react";
import { categories, posts } from "@/lib/data";
import { MAIN_NAV, SITE } from "@/lib/site";
import SearchBox from "./SearchBox";
import CategoryMenu from "./CategoryMenu";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const cats = categories.map(({ slug, name }) => ({ slug, name }));
  const postLinks = posts.slice(0, 6).map((p) => ({ href: `/tin-tuc/${p.slug}`, label: p.title }));

  return (
    <header className="relative z-40 bg-white">
      {/* Thanh trên cùng */}
      <div className="bg-brand text-white">
        <div className="container-site flex items-center justify-center gap-4 py-2 md:justify-between">
          <p className="text-center text-[12px] font-bold uppercase leading-snug md:text-left">{SITE.slogan}</p>
          <div className="hidden shrink-0 items-center gap-3 text-[12px] font-bold md:flex">
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-1 hover:underline">
              <Phone className="h-3.5 w-3.5" /> {SITE.phone}
            </a>
            <span className="h-3.5 w-px bg-white/40" />
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1 hover:underline">
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
          </div>
        </div>
      </div>

      {/* Logo, tìm kiếm, hotline — máy tính */}
      <div className="container-site hidden items-center gap-6 py-3 lg:flex">
        <Link href="/" className="flex w-[250px] shrink-0 justify-center" aria-label="Trang chủ P-Home">
          <Image src="/images/logo.png" alt="P-Home" width={300} height={89} priority className="h-[72px] w-auto" />
        </Link>
        <div className="flex-1">
          <SearchBox />
        </div>
        <a href={`tel:${SITE.phone}`} className="shrink-0 px-4 text-center leading-tight">
          <div className="text-[13px] font-bold text-black">HOTLINE</div>
          <div className="text-[15px] font-bold tracking-[0.12em] text-hot">{SITE.phone}</div>
        </a>
        <a href={SITE.maps} target="_blank" rel="noopener noreferrer" className="flex shrink-0 flex-col items-center text-[9px] text-gray-500">
          <Image src="/images/google-map.png" alt="" width={32} height={32} className="h-8 w-auto" />
          Google Maps
        </a>
      </div>

      {/* Menu chính — máy tính */}
      <div className="container-site hidden items-stretch lg:flex">
        <CategoryMenu categories={cats} />
        <nav className="flex flex-1 items-center justify-around pl-4">
          {MAIN_NAV.map((item) => {
            const sub =
              item.dropdown === "products"
                ? cats.map((c) => ({ href: `/danh-muc/${c.slug}`, label: c.name }))
                : item.dropdown === "posts"
                  ? postLinks
                  : null;
            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 py-3 text-[20px] font-bold uppercase text-brand transition-colors hover:text-brand-darker"
                >
                  {item.label}
                  {sub && <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />}
                </Link>
                {sub && (
                  <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-2 border-t-2 border-brand bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {sub.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="block border-b border-line px-4 py-2.5 text-[14px] text-ink transition-colors last:border-0 hover:bg-soft hover:text-brand"
                      >
                        <span className="line-clamp-2">{s.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Điện thoại / máy tính bảng */}
      <MobileMenu categories={cats} />
    </header>
  );
}
