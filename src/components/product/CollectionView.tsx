import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductListing from "./ProductListing";
import CategorySidebar from "./CategorySidebar";
import { toCard } from "./ProductCard";
import { categoryBanner, type Product } from "@/lib/data";

/** Trang danh sách sản phẩm (tất cả hoặc theo danh mục) */
export default function CollectionView({
  title,
  slug,
  items,
}: {
  title: string;
  slug?: string;
  items: Product[];
}) {
  return (
    <>
      <Breadcrumb items={[{ label: title }]} />
      <div className="container-site pb-16 pt-6">
        <h1 className="text-[18px] font-medium uppercase text-ink">{title}</h1>
        {(() => {
          const b = categoryBanner(slug);
          return (
            <Image
              src={b.src}
              alt={title}
              width={b.width}
              height={b.height}
              priority
              sizes="(max-width: 1065px) 100vw, 1035px"
              className="mt-3 h-auto w-full"
            />
          );
        })()}
        <div className="mt-6">
          <ProductListing products={items.map(toCard)} sidebar={<CategorySidebar active={slug} />} />
        </div>
      </div>
    </>
  );
}
