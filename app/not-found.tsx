import Link from "next/link";
import { SITE } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="container-site flex flex-col items-center py-20 text-center">
      <div className="text-[72px] font-bold leading-none text-brand">404</div>
      <h1 className="mt-3 text-[20px] font-medium text-ink">Không tìm thấy trang bạn yêu cầu</h1>
      <p className="mt-2 text-[14px] text-gray-600">Trang có thể đã được đổi địa chỉ hoặc không còn tồn tại.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="bg-brand px-6 py-2.5 font-bold text-white hover:bg-brand-dark">Về trang chủ</Link>
        <Link href="/san-pham" className="border border-brand px-6 py-2.5 font-bold text-brand hover:bg-brand hover:text-white">Xem sản phẩm</Link>
        <a href={`tel:${SITE.phone}`} className="px-6 py-2.5 font-bold text-hot">Gọi {SITE.phone}</a>
      </div>
    </div>
  );
}
