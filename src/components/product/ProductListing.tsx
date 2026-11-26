"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard, { type CardProduct } from "./ProductCard";

const PER_PAGE = 18;

const SORTS = [
  { id: "default", label: "Mặc định" },
  { id: "az", label: "Tên A-Z" },
  { id: "za", label: "Tên Z-A" },
  { id: "asc", label: "Giá thấp đến cao" },
  { id: "desc", label: "Giá cao xuống thấp" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

const PRICES = [
  { id: "lt1", label: "Dưới 1.000.000₫", test: (n: number) => n < 1_000_000 },
  { id: "1-3", label: "1.000.000₫ - 3.000.000₫", test: (n: number) => n >= 1_000_000 && n < 3_000_000 },
  { id: "3-5", label: "3.000.000₫ - 5.000.000₫", test: (n: number) => n >= 3_000_000 && n < 5_000_000 },
  { id: "5-10", label: "5.000.000₫ - 10.000.000₫", test: (n: number) => n >= 5_000_000 && n < 10_000_000 },
  { id: "gt10", label: "Trên 10.000.000₫", test: (n: number) => n >= 10_000_000 },
];

export default function ProductListing({ products, sidebar }: { products: CardProduct[]; sidebar?: ReactNode }) {
  const [sort, setSort] = useState<SortId>("default");
  const [prices, setPrices] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Chỉ hiện khoảng giá có sản phẩm
  const priceOptions = PRICES.filter((r) => products.some((p) => p.price > 0 && r.test(p.price)));

  const list = useMemo(() => {
    let l = products;
    if (prices.length) {
      const tests = PRICES.filter((r) => prices.includes(r.id));
      l = l.filter((p) => tests.some((r) => r.test(p.price)));
    }
    const s = [...l];
    if (sort === "az") s.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    if (sort === "za") s.sort((a, b) => b.name.localeCompare(a.name, "vi"));
    // sản phẩm "Liên hệ" (giá 0) luôn nằm cuối khi sắp theo giá
    if (sort === "asc") s.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    if (sort === "desc") s.sort((a, b) => b.price - a.price);
    return s;
  }, [products, sort, prices]);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = list.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  function togglePrice(id: string) {
    setPrices((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
    setPage(1);
  }
  function gotoPage(n: number) {
    setPage(n);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filterPanel = (
    <>
      {sidebar}
      {priceOptions.length > 1 && (
        <div className="mt-5 border border-line p-3">
          <h2 className="border-b border-line pb-2 text-[15px] font-medium uppercase text-ink">Tìm theo</h2>
          <h3 className="mt-3 text-[14px] font-medium uppercase text-ink">Giá sản phẩm</h3>
          <ul className="mt-2 space-y-1">
            {priceOptions.map((r) => (
              <li key={r.id}>
                <label className="flex cursor-pointer items-center gap-2 py-1 text-[14px] text-gray-600 hover:text-brand">
                  <input
                    type="checkbox"
                    checked={prices.includes(r.id)}
                    onChange={() => togglePrice(r.id)}
                    className="h-4 w-4 accent-[#23784f]"
                  />
                  {r.label}
                </label>
              </li>
            ))}
          </ul>
          {prices.length > 0 && (
            <button type="button" onClick={() => { setPrices([]); setPage(1); }} className="mt-2 text-[13px] text-brand underline">
              Bỏ lọc giá
            </button>
          )}
        </div>
      )}
    </>
  );

  return (
    <div ref={topRef} className="grid scroll-mt-4 gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block">{filterPanel}</aside>

      {/* Bộ lọc trên điện thoại */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Bộ lọc sản phẩm">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-[320px] overflow-y-auto bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold uppercase">Bộ lọc</span>
              <button type="button" onClick={() => setFilterOpen(false)} aria-label="Đóng bộ lọc" className="p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
            <button type="button" onClick={() => setFilterOpen(false)} className="mt-4 w-full bg-brand py-2.5 font-bold text-white">
              Xem {list.length} sản phẩm
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-3 text-[14px]">
          <span className="font-medium text-ink">Xếp theo:</span>
          {SORTS.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-1.5 text-gray-700 hover:text-brand">
              <input
                type="radio"
                name="sort"
                checked={sort === s.id}
                onChange={() => { setSort(s.id); setPage(1); }}
                className="h-3.5 w-3.5 accent-[#23784f]"
              />
              {s.label}
            </label>
          ))}
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="ml-auto flex items-center gap-1.5 bg-brand px-3 py-1.5 text-[13px] font-bold text-white lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Lọc
          </button>
        </div>

        <p className="mb-3 text-[13px] text-gray-500">{list.length} sản phẩm</p>

        {shown.length ? (
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
            {shown.map((p, k) => (
              <ProductCard key={p.slug} p={p} priority={k < 3} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-gray-500">Không có sản phẩm phù hợp với bộ lọc.</p>
        )}

        {pages > 1 && (
          <nav aria-label="Phân trang" className="mt-8 flex justify-center gap-1">
            <button type="button" disabled={current === 1} onClick={() => gotoPage(current - 1)} className="h-9 min-w-9 border border-line px-2 disabled:opacity-40" aria-label="Trang trước">
              «
            </button>
            {Array.from({ length: pages }, (_, k) => k + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => gotoPage(n)}
                aria-current={n === current ? "page" : undefined}
                className={`h-9 min-w-9 border px-2 ${n === current ? "border-brand bg-brand text-white" : "border-line hover:border-brand hover:text-brand"}`}
              >
                {n}
              </button>
            ))}
            <button type="button" disabled={current === pages} onClick={() => gotoPage(current + 1)} className="h-9 min-w-9 border border-line px-2 disabled:opacity-40" aria-label="Trang sau">
              »
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
