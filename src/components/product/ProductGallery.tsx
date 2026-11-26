"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => (v + d + images.length) % images.length);

  return (
    <div>
      <div className="group relative aspect-square overflow-hidden bg-soft">
        <Image
          key={images[i]}
          src={images[i]}
          alt={`${name} – ảnh ${i + 1}`}
          fill
          priority={i === 0}
          sizes="(max-width: 768px) 100vw, 510px"
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Ảnh trước" className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow transition-opacity md:opacity-0 md:group-hover:opacity-100 focus:opacity-100">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Ảnh tiếp theo" className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow transition-opacity md:opacity-0 md:group-hover:opacity-100 focus:opacity-100">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar mt-2.5 flex gap-2.5 overflow-x-auto">
          {images.map((src, k) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Xem ảnh ${k + 1}`}
              aria-current={k === i}
              className={`relative aspect-square w-[22%] shrink-0 overflow-hidden border-2 bg-white sm:w-[18%] ${
                k === i ? "border-brand" : "border-line hover:border-gray-300"
              }`}
            >
              <Image src={src} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
