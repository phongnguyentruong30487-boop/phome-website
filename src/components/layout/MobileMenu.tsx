"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { MAIN_NAV, SITE } from "@/lib/site";
import SearchBox from "./SearchBox";

type Cat = { slug: string; name: string };
const VISIBLE = 6;

export default function MobileMenu({ categories }: { categories: Cat[] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [allCats, setAllCats] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();

  // Đóng menu khi chuyển trang (điều chỉnh state ngay khi render, không cần effect)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
    setSearch(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cats = allCats ? categories : categories.slice(0, VISIBLE);

  return (
    <div className="lg:hidden">
      <div className="container-site grid grid-cols-[1fr_auto_1fr] items-center py-2">
        <button type="button" onClick={() => setOpen(true)} aria-label="Mở menu" aria-expanded={open} className="-ml-1 justify-self-start p-1">
          <Menu className="h-7 w-7 text-ink" />
        </button>
        <Link href="/" aria-label="Trang chủ P-Home">
          <Image src="/images/logo.png" alt="P-Home" width={300} height={89} priority className="h-14 w-auto" />
        </Link>
        <div className="flex items-center gap-3 justify-self-end">
          <button type="button" onClick={() => setSearch((v) => !v)} aria-label="Tìm kiếm" aria-expanded={search} className="p-1">
            {search ? <X className="h-6 w-6 text-ink" /> : <Search className="h-6 w-6 text-ink" />}
          </button>
          <a href={`tel:${SITE.phone}`} aria-label={`Gọi ${SITE.phone}`} className="p-1 text-hot">
            <Phone className="h-6 w-6" />
          </a>
        </div>
      </div>
      {search && (
        <div className="container-site pb-3">
          <SearchBox autoFocus onDone={() => setSearch(false)} />
        </div>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-[340px] flex-col overflow-y-auto bg-white px-4 pb-8"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between border-b border-line py-3">
                <span className="w-8" />
                <Image src="/images/logo.png" alt="P-Home" width={300} height={89} className="h-12 w-auto" />
                <button type="button" onClick={() => setOpen(false)} aria-label="Đóng menu" className="p-1">
                  <ArrowLeft className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2 bg-brand px-3 py-3 text-[15px] font-bold uppercase text-white">
                <Menu className="h-5 w-5" /> Tất cả sản phẩm
              </div>
              <ul>
                {cats.map((c) => (
                  <li key={c.slug} className="border-b border-line">
                    <Link href={`/danh-muc/${c.slug}`} className="block px-2 py-3 text-[16px] text-ink">
                      {c.name}
                    </Link>
                  </li>
                ))}
                {categories.length > VISIBLE && (
                  <li>
                    <button type="button" onClick={() => setAllCats((v) => !v)} className="w-full px-2 py-3 text-left text-[16px] font-bold">
                      {allCats ? "Thu gọn" : "Xem thêm ..."}
                    </button>
                  </li>
                )}
              </ul>

              <ul className="mt-4 border-t-2 border-brand">
                {MAIN_NAV.map((item) =>
                  item.dropdown === "products" ? (
                    <li key={item.href} className="border-b border-line">
                      <div className="flex items-center justify-between">
                        <Link href={item.href} className="flex-1 px-2 py-3 text-[16px] font-medium tracking-wide">
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProductsOpen((v) => !v)}
                          aria-label="Mở danh mục sản phẩm"
                          aria-expanded={productsOpen}
                          className="p-3"
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                      {productsOpen && (
                        <ul className="pb-2 pl-4">
                          {categories.map((c) => (
                            <li key={c.slug}>
                              <Link href={`/danh-muc/${c.slug}`} className="block px-2 py-2 text-[15px] text-gray-600">
                                {c.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={item.href} className="border-b border-line">
                      <Link href={item.href} className="block px-2 py-3 text-[16px] font-medium tracking-wide">
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              <a href={`tel:${SITE.phone}`} className="mt-6 flex items-center justify-center gap-2 rounded bg-hot py-3 font-bold text-white">
                <Phone className="h-4 w-4" /> Gọi ngay {SITE.phoneDisplay}
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
