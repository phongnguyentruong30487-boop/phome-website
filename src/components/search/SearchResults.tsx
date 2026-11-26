"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard, { type CardProduct } from "@/components/product/ProductCard";
import SearchBox from "@/components/layout/SearchBox";
import { matchAll } from "@/lib/format";

export type SearchItem = CardProduct & { sku: string };

/** Tìm kiếm chạy trên trình duyệt (web xuất tĩnh không có server để xử lý ?q=) */
export default function SearchResults({ items, categories }: { items: SearchItem[]; categories: { slug: string; name: string }[] }) {
  const q = useSearchParams().get("q")?.trim() ?? "";
  const results = q ? matchAll(items, q, (p) => `${p.name} ${p.sku}`) : [];

  return (
    <>
      <h1 className="text-[22px] font-medium leading-snug text-ink">
        {q ? `Kết quả tìm kiếm cho “${q}”` : "Tìm kiếm sản phẩm"}
      </h1>
      <div className="mt-4 max-w-xl">
        <SearchBox key={q} initial={q} />
      </div>
      {q && <p className="mt-4 text-[14px] text-gray-600">Tìm thấy {results.length} sản phẩm.</p>}
      {results.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        q && (
          <div className="mt-6 text-[14px]">
            <p>Không tìm thấy sản phẩm phù hợp. Thử từ khóa khác hoặc xem theo danh mục:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link key={c.slug} href={`/danh-muc/${c.slug}/`} className="border border-line px-3 py-1.5 hover:border-brand hover:text-brand">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
}
