"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

export default function SearchBox({ autoFocus, onDone }: { autoFocus?: boolean; onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(term)}`);
    onDone?.();
  }

  return (
    <form onSubmit={submit} role="search" className="flex h-9 w-full border border-brand bg-white">
      <label htmlFor="site-search" className="sr-only">
        Tìm sản phẩm
      </label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Tìm sản phẩm: tủ áo, kệ sắt, tủ bếp..."
        className="min-w-0 flex-1 px-3 text-[14px] outline-none"
      />
      <button type="submit" aria-label="Tìm kiếm" className="px-3 text-brand transition-colors hover:text-brand-darker">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
