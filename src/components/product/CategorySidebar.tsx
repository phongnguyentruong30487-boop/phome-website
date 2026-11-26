import Link from "next/link";
import { categories, productsIn } from "@/lib/data";

export default function CategorySidebar({ active }: { active?: string }) {
  return (
    <div>
      <h2 className="text-[15px] font-medium uppercase text-ink">
        <span className="inline-block border-b-2 border-brand pb-1.5">Danh mục</span>
      </h2>
      <ul className="mt-2 border border-line">
        <li className="border-b border-line">
          <Link
            href="/san-pham"
            className={`block px-3 py-2 text-[14px] transition-colors hover:text-brand ${!active ? "font-bold text-brand" : "text-ink"}`}
          >
            Tất cả sản phẩm
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug} className="border-b border-line last:border-0">
            <Link
              href={`/danh-muc/${c.slug}`}
              aria-current={active === c.slug ? "page" : undefined}
              className={`flex justify-between px-3 py-2 text-[14px] transition-colors hover:text-brand ${
                active === c.slug ? "font-bold text-brand" : "text-ink"
              }`}
            >
              {c.name}
              <span className="text-gray-400">({productsIn(c.slug).length})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
