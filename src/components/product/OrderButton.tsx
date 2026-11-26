"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

const input = "w-full border border-gray-300 px-3 py-2.5 text-[14px] outline-none focus:border-brand";

/**
 * Nút "MUA NGAY" kiểu web cũ. Chưa có giỏ hàng/backend nên mở form đặt hàng,
 * gửi đơn qua ứng dụng email của khách (điền sẵn nội dung) hoặc chuyển sang Zalo.
 */
export default function OrderButton({ name, sku, price }: { name: string; sku: string; price: number }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const total = price > 0 ? formatPrice(price * qty) : "Liên hệ";
    const body = [
      `Sản phẩm: ${name}${sku ? ` (${sku})` : ""}`,
      `Số lượng: ${qty}`,
      `Tạm tính: ${total}`,
      "",
      `Họ tên: ${f.get("name")}`,
      `Điện thoại: ${f.get("phone")}`,
      `Địa chỉ giao hàng: ${f.get("address")}`,
      `Ghi chú: ${f.get("note") || "-"}`,
    ].join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Đặt hàng: ${name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-[14px] text-ink">Số lượng:</span>
        <div className="flex h-10 items-center border border-line">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Giảm số lượng" className="flex h-full w-10 items-center justify-center hover:text-brand">
            <Minus className="h-4 w-4" />
          </button>
          <input
            aria-label="Số lượng"
            inputMode="numeric"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
            className="h-full w-10 text-center outline-none"
          />
          <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Tăng số lượng" className="flex h-full w-10 items-center justify-center hover:text-brand">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={() => { setSent(false); setOpen(true); }}
          className="flex-1 rounded-md bg-hot px-5 py-2.5 text-center text-white shadow transition-colors hover:bg-[#c8161d] sm:flex-none"
        >
          <span className="block text-[15px] font-bold uppercase tracking-wide">
            Mua ngay {price > 0 && <>với giá {formatPrice(price)}</>}
          </span>
          <span className="block text-[12px] tracking-wide">Đặt mua giao hàng tận nơi</span>
        </button>
        <a
          href={SITE.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-md border-2 border-[#0068ff] px-5 py-2 text-[#0068ff] transition-colors hover:bg-[#0068ff] hover:text-white"
        >
          <span className="text-[15px] font-bold uppercase">Chat Zalo</span>
          <span className="text-[12px]">Tư vấn &amp; báo giá</span>
        </a>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && setOpen(false)}
        className="m-auto w-[calc(100%-2rem)] max-w-md bg-white p-0 backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between bg-brand px-5 py-3 text-white">
          <h2 className="font-bold uppercase">Đặt mua sản phẩm</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Đóng" className="p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3 p-5">
          <div className="bg-soft p-3 text-[14px]">
            <div className="font-medium text-ink">{name}</div>
            <div className="mt-1 text-gray-600">
              Số lượng: {qty} · Tạm tính: <b className="text-hot">{price > 0 ? formatPrice(price * qty) : "Liên hệ"}</b>
            </div>
          </div>
          <div>
            <label htmlFor="o-name" className="mb-1 block text-[13px] font-medium">Họ và tên *</label>
            <input id="o-name" name="name" required autoComplete="name" className={input} />
          </div>
          <div>
            <label htmlFor="o-phone" className="mb-1 block text-[13px] font-medium">Số điện thoại *</label>
            <input id="o-phone" name="phone" type="tel" required pattern="[0-9 +.]{9,15}" autoComplete="tel" className={input} />
          </div>
          <div>
            <label htmlFor="o-address" className="mb-1 block text-[13px] font-medium">Địa chỉ giao hàng *</label>
            <input id="o-address" name="address" required autoComplete="street-address" className={input} />
          </div>
          <div>
            <label htmlFor="o-note" className="mb-1 block text-[13px] font-medium">Ghi chú (màu sắc, kích thước…)</label>
            <textarea id="o-note" name="note" rows={2} className={input} />
          </div>
          <button type="submit" className="w-full bg-hot py-3 font-bold uppercase text-white transition-colors hover:bg-[#c8161d]">
            Gửi đơn đặt hàng
          </button>
          {sent ? (
            <p role="status" className="text-center text-[13px] text-brand">
              Ứng dụng email đã được mở với đơn hàng điền sẵn — bấm Gửi để hoàn tất. P-Home sẽ gọi lại xác nhận.
            </p>
          ) : (
            <p className="text-center text-[13px] text-gray-500">
              Hoặc gọi ngay <a href={`tel:${SITE.phone}`} className="font-bold text-hot">{SITE.phone}</a> để đặt hàng nhanh.
            </p>
          )}
        </form>
      </dialog>
    </>
  );
}
