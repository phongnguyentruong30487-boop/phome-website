import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import ProductCard, { toCard } from "@/components/product/ProductCard";
import SearchBox from "@/components/layout/SearchBox";
import { categories, searchProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Tìm kiếm", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  const results = q ? searchProducts(q) : [];

  return (
    <PageShell title={q ? `Kết quả tìm kiếm cho “${q}”` : "Tìm kiếm sản phẩm"} crumbs={[{ label: "Tìm kiếm" }]}>
      <div className="max-w-xl">
        <SearchBox />
      </div>
      {q && <p className="mt-4 text-[14px] text-gray-600">Tìm thấy {results.length} sản phẩm.</p>}
      {results.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} p={toCard(p)} />
          ))}
        </div>
      ) : (
        q && (
          <div className="mt-6 text-[14px]">
            <p>Không tìm thấy sản phẩm phù hợp. Thử từ khóa khác hoặc xem theo danh mục:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link key={c.slug} href={`/danh-muc/${c.slug}`} className="border border-line px-3 py-1.5 hover:border-brand hover:text-brand">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )
      )}
    </PageShell>
  );
}
