"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { src: "/images/slider/1.jpg", href: "/gioi-thieu", alt: "Trang trí nội thất P-Home – Uy tín, tận tâm" },
  { src: "/images/slider/2.jpg", href: "/danh-muc/ke-sat-trang-tri", alt: "Kệ sắt trang trí – Mua ngay" },
  { src: "/images/slider/3.jpg", href: "/danh-muc/ke-sat-trang-tri", alt: "Kệ trang trí giảm giá cực mạnh" },
  { src: "/images/slider/4.jpg", href: "/lien-he", alt: "Nội thất P-Home – Liên hệ 0934 787 123" },
  { src: "/images/slider/5.jpg", href: "/gioi-thieu", alt: "Thi công hoàn thiện nội thất P-Home" },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((d: number) => setI((v) => (v + d + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Banner P-Home"
      className="group relative aspect-[600/225] w-full overflow-hidden bg-soft"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Tất cả slide nằm sẵn trong trang (ảnh tải trước), chỉ đổi độ mờ → không bị trắng khi chuyển */}
      {SLIDES.map((s, k) => (
        <Link
          key={s.src}
          href={s.href}
          aria-label={s.alt}
          aria-hidden={k !== i}
          tabIndex={k === i ? 0 : -1}
          className={`absolute inset-0 transition-opacity duration-700 ${k === i ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <Image src={s.src} alt={s.alt} fill priority={k === 0} loading={k === 0 ? undefined : "eager"} sizes="(max-width: 1024px) 100vw, 790px" className="object-cover" />
        </Link>
      ))}

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Ảnh trước"
        className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink opacity-0 shadow transition-opacity focus:opacity-100 group-hover:opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Ảnh tiếp theo"
        className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink opacity-0 shadow transition-opacity focus:opacity-100 group-hover:opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/50 px-2 py-1.5">
        {SLIDES.map((s, k) => (
          <button
            key={k}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Xem ảnh ${k + 1}`}
            aria-current={k === i}
            className={`h-2 rounded-full transition-all ${k === i ? "w-2 bg-brand" : "w-5 bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>
    </section>
  );
}
