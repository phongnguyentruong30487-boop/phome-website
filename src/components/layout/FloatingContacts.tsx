"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronUp, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { FacebookIcon, ZaloIcon } from "@/components/ui/BrandIcons";

/** Nút liên hệ nổi: gọi điện (góc trái dưới) + cột mạng xã hội & lên đầu trang (bên phải) */
export default function FloatingContacts() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circle =
    "flex h-11 w-11 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-transform hover:scale-110";

  return (
    <>
      <a
        href={`tel:${SITE.phone}`}
        aria-label={`Gọi hotline ${SITE.phone}`}
        className="fixed bottom-4 left-3 z-40 flex items-center rounded-full bg-hot py-1 pl-1 pr-1 text-white shadow-lg sm:pr-4"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-hot">
          <Phone className="animate-ring h-5 w-5" fill="currentColor" />
        </span>
        <span className="ml-2 hidden text-[17px] font-bold sm:inline">{SITE.phone}</span>
      </a>

      <div className="fixed bottom-4 right-3 z-40 flex flex-col items-center gap-3">
        <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook P-Home" className={`${circle} bg-[#1877f2] text-white`}>
          <FacebookIcon className="h-6 w-6" />
        </a>
        <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo với P-Home" className={`${circle} bg-white text-[#0068ff]`}>
          <ZaloIcon className="h-9 w-9" />
        </a>
        <a href={SITE.maps} target="_blank" rel="noopener noreferrer" aria-label="Chỉ đường Google Maps" className={`${circle} bg-white`}>
          <Image src="/images/google-map.png" alt="" width={26} height={26} className="h-6 w-auto" />
        </a>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Lên đầu trang"
          className={`flex h-10 w-10 items-center justify-center bg-black text-white transition-opacity ${
            showTop ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
