import type { Metadata } from "next";
import CollectionView from "@/components/product/CollectionView";
import { products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description: "Toàn bộ sản phẩm nội thất P-Home: kệ sắt trang trí, tủ áo, tủ bếp, giường ngủ, tủ giày, bàn học, kệ tivi...",
};

export default function AllProductsPage() {
  return <CollectionView title="Tất cả sản phẩm" items={products} />;
}
