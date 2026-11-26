import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { href?: string; label: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-y border-line bg-white">
      <ol className="container-site flex flex-wrap items-center gap-1 py-2.5 text-[14px] text-ink">
        <li>
          <Link href="/" className="transition-colors hover:text-brand">
            Trang chủ
          </Link>
        </li>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              {c.href && !last ? (
                <Link href={c.href} className="transition-colors hover:text-brand">
                  {c.label}
                </Link>
              ) : (
                <span className={last && items.length > 1 ? "text-brand" : "font-medium"} aria-current={last ? "page" : undefined}>
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
