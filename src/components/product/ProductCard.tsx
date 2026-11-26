import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export type CardProduct = {
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  image: string;
};

export const toCard = (p: {
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  images: string[];
}): CardProduct => ({ slug: p.slug, name: p.name, price: p.price, oldPrice: p.oldPrice, image: p.images[0] });

export default function ProductCard({ p, priority }: { p: CardProduct; priority?: boolean }) {
  const off = p.oldPrice > p.price && p.price > 0 ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  return (
    <div className="group h-full bg-soft transition-shadow duration-300 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.2)]">
      <Link href={`/san-pham/${p.slug}`} className="relative block aspect-square overflow-hidden bg-white">
        <Image
          src={p.image}
          alt={p.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        {off > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded-sm bg-hot px-2 py-0.5 text-[11px] font-bold text-white">
            - {off}%
          </span>
        )}
      </Link>
      <div className="px-2 pb-3 pt-3 text-center">
        <div className="text-[12px] text-[#b2b2b2]">Nội Thất P - Home</div>
        <h3 className="mt-1 truncate text-[14px] text-ink">
          <Link href={`/san-pham/${p.slug}`} title={p.name} className="transition-colors hover:text-brand">
            {p.name}
          </Link>
        </h3>
        <div className="mt-1.5 flex flex-wrap items-baseline justify-center gap-x-2">
          <span className="text-[15px] font-bold text-brand">{formatPrice(p.price)}</span>
          {off > 0 && <span className="text-[13px] text-[#b2b2b2] line-through">{formatPrice(p.oldPrice)}</span>}
        </div>
      </div>
    </div>
  );
}
