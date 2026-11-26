"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";

const input = "w-full border border-gray-300 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-brand";

// Chưa có backend: mở ứng dụng email của khách với nội dung đã điền sẵn.
export default function ContactForm() {
  const [opened, setOpened] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "");
    const body = [
      `Họ và tên: ${name}`,
      `Số điện thoại: ${f.get("phone")}`,
      `Email: ${f.get("email") || "-"}`,
      "",
      String(f.get("message") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Yêu cầu tư vấn - ${name}`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-1 block text-[13px] font-medium">Họ và tên *</label>
          <input id="c-name" name="name" required autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="c-phone" className="mb-1 block text-[13px] font-medium">Số điện thoại *</label>
          <input id="c-phone" name="phone" type="tel" required pattern="[0-9 +.]{9,15}" autoComplete="tel" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="c-email" className="mb-1 block text-[13px] font-medium">Email</label>
        <input id="c-email" name="email" type="email" autoComplete="email" className={input} />
      </div>
      <div>
        <label htmlFor="c-message" className="mb-1 block text-[13px] font-medium">Nội dung *</label>
        <textarea id="c-message" name="message" rows={5} required placeholder="Bạn đang quan tâm sản phẩm nào, kích thước không gian ra sao?" className={input} />
      </div>
      <button type="submit" className="bg-brand px-8 py-3 font-bold uppercase text-white transition-colors hover:bg-brand-dark">
        Gửi liên hệ
      </button>
      {opened && (
        <p role="status" className="text-[13px] text-brand">
          Ứng dụng email đã được mở với nội dung điền sẵn — bấm Gửi để hoàn tất, hoặc gọi {SITE.phoneDisplay}.
        </p>
      )}
    </form>
  );
}
