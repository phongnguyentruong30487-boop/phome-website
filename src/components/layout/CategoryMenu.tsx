"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";

type Cat = { slug: string; name: string };
const VISIBLE = 7;

/** Nút "TẤT CẢ SẢN PHẨM": mở khi rê chuột / bấm vào, đóng khi rê ra hoặc bấm ra ngoài. */
export default function CategoryMenu({ categories }: { categories: Cat[] }) {
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState(false);
  const shown = all ? categories : categories.slice(0, VISIBLE);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative w-[250px] shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-full w-full items-center gap-2 bg-brand px-3 py-3 text-[14px] font-bold uppercase text-white"
      >
        <Menu className="h-4 w-4" /> Tất cả sản phẩm <ChevronDown className="h-4 w-4" />
      </button>
      <ul
        className={`absolute left-0 top-full z-50 w-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] ${
          open ? "block" : "hidden"
        }`}
      >
        {shown.map((c) => (
          <li key={c.slug} className="mx-2 border-b border-line last:border-0">
            <Link
              href={`/danh-muc/${c.slug}`}
              className="flex items-center gap-2 px-1 py-2.5 text-[14px] text-ink transition-colors hover:text-brand"
            >
              <ChevronRight className="h-3.5 w-3.5 text-gray-500" /> {c.name}
            </Link>
          </li>
        ))}
        {categories.length > VISIBLE && (
          <li className="mx-2">
            <button
              type="button"
              onClick={() => setAll((v) => !v)}
              className="flex w-full items-center gap-2 px-1 py-2.5 text-left text-[14px] font-bold text-ink hover:text-brand"
            >
              <ChevronRight className="h-3.5 w-3.5 text-gray-500" /> {all ? "Thu gọn" : "Xem thêm ..."}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
