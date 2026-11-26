import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SearchResults, { type SearchItem } from "@/components/search/SearchResults";
import { toCard } from "@/components/product/ProductCard";
import { categories, products } from "@/lib/data";

export const metadata: Metadata = { title: "Tìm kiếm", robots: { index: false } };

export default function SearchPage() {
  // Danh sách rút gọn chỉ gồm thông tin cần cho thẻ sản phẩm, nhúng sẵn vào trang tĩnh
  const items: SearchItem[] = products.map((p) => ({ ...toCard(p), sku: p.sku }));
  const cats = categories.map(({ slug, name }) => ({ slug, name }));

  return (
    <>
      <Breadcrumb items={[{ label: "Tìm kiếm" }]} />
      <div className="container-site pb-16 pt-6">
        {/* useSearchParams cần Suspense khi xuất tĩnh */}
        <Suspense fallback={<h1 className="text-[22px] font-medium text-ink">Tìm kiếm sản phẩm</h1>}>
          <SearchResults items={items} categories={cats} />
        </Suspense>
      </div>
    </>
  );
}
