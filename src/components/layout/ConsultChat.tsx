"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { SITE } from "@/lib/site";

type Message = {
  role: "bot" | "user";
  text: string;
};

type Faq = {
  id: string;
  label: string;
  keywords: string[];
  reply: string;
};

/**
 * Trợ lý tư vấn dựng sẵn (không gọi AI/backend — site tĩnh không có máy chủ).
 * Trả lời dựa trên từ khoá khớp với các câu hỏi thường gặp; nếu không khớp,
 * hướng khách sang hotline/Zalo để được tư vấn trực tiếp.
 */
const FAQS: Faq[] = [
  {
    id: "giao-hang",
    label: "Giao hàng & lắp đặt",
    keywords: ["giao hang", "giao hàng", "ship", "van chuyen", "vận chuyển", "lap dat", "lắp đặt", "phi ship", "phí ship", "bao lau", "bao lâu"],
    reply:
      "P-Home miễn phí giao hàng & lắp đặt tại TP. HCM, TP. Thủ Đức, Dĩ An, Thuận An trong vòng 3 ngày làm việc (9h-16h, thứ Hai - thứ Bảy). Một số khu vực xa hơn ở Bình Dương sẽ có phụ phí. Xem chi tiết tại trang Chính sách giao hàng & lắp đặt.",
  },
  {
    id: "bao-hanh",
    label: "Bảo hành",
    keywords: ["bao hanh", "bảo hành", "bao tri", "bảo trì", "hu hong", "hư hỏng", "loi", "lỗi sản phẩm"],
    reply:
      "Sản phẩm P-Home được bảo hành 2 năm kể từ ngày giao hàng thành công đối với lỗi chất liệu, kỹ thuật và lắp đặt từ phía P-Home. Riêng khung/mâm/cần ghế văn phòng bảo hành 1 năm. Chi tiết tại trang Chính sách bảo hành & bảo trì.",
  },
  {
    id: "doi-tra",
    label: "Đổi trả",
    keywords: ["doi tra", "đổi trả", "tra hang", "trả hàng", "doi hang", "đổi hàng", "hoan tien", "hoàn tiền"],
    reply:
      "Trong vòng 3 ngày kể từ khi nhận hàng, bạn được đổi sản phẩm miễn phí nếu sản phẩm lỗi do P-Home. Việc trả hàng tại thời điểm giao hàng (đặt nhầm/đổi ý) sẽ tính phí vận chuyển & lắp đặt. Chi tiết tại trang Chính sách đổi trả.",
  },
  {
    id: "thanh-toan",
    label: "Thanh toán",
    keywords: ["thanh toan", "thanh toán", "tra gop", "trả góp", "chuyen khoan", "chuyển khoản", "coc", "cọc", "tien mat", "tiền mặt"],
    reply:
      "P-Home nhận thanh toán tiền mặt khi giao hàng hoặc chuyển khoản ngân hàng. Với đơn hàng đồ gỗ, có thể thanh toán trước 50% khi đặt, phần còn lại thanh toán khi nhận hàng. Hiện P-Home chưa hỗ trợ trả góp qua thẻ tín dụng/công ty tài chính; bạn hỏi trực tiếp nhân viên nếu cần tư vấn thêm.",
  },
  {
    id: "dia-chi",
    label: "Địa chỉ & liên hệ",
    keywords: ["dia chi", "địa chỉ", "showroom", "cua hang", "cửa hàng", "o dau", "ở đâu", "gio mo cua", "giờ mở cửa", "lien he", "liên hệ"],
    reply: `P-Home ở ${SITE.address}. Hotline: ${SITE.phoneDisplay}, Email: ${SITE.email}. Bạn có thể gọi hoặc nhắn Zalo để được hướng dẫn đường đi chi tiết.`,
  },
  {
    id: "dat-hang",
    label: "Cách đặt hàng",
    keywords: ["dat hang", "đặt hàng", "mua hang", "mua hàng", "order", "cach mua", "cách mua"],
    reply:
      "Bạn chọn sản phẩm rồi bấm “Mua ngay” để điền thông tin, hoặc gọi hotline / nhắn Zalo để được tư vấn trực tiếp. P-Home sẽ gọi lại xác nhận đơn, màu sắc, kích thước và lịch giao hàng trước khi giao & lắp đặt tận nơi.",
  },
  {
    id: "gia",
    label: "Báo giá",
    keywords: ["gia bao nhieu", "giá bao nhiêu", "bao gia", "báo giá", "gia san pham", "giá sản phẩm", "chiet khau", "chiết khấu", "giam gia", "giảm giá"],
    reply:
      "Giá niêm yết đã có trên từng sản phẩm. Với đơn số lượng lớn hoặc theo yêu cầu riêng (kích thước, chất liệu), bạn gọi hotline hoặc nhắn Zalo để được báo giá chính xác và ưu đãi (nếu có) nhé.",
  },
];

const GREETING: Message = {
  role: "bot",
  text: `Chào bạn 👋 Mình là trợ lý tư vấn của P-Home. Bạn muốn hỏi về giao hàng, bảo hành, đổi trả, thanh toán hay thông tin nào khác? Bạn có thể chọn nhanh bên dưới hoặc gõ câu hỏi.`,
};

function stripAccents(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function findReply(input: string): string {
  const q = stripAccents(input);
  for (const faq of FAQS) {
    if (faq.keywords.some((kw) => q.includes(stripAccents(kw)))) {
      return faq.reply;
    }
  }
  return `Mình chưa chắc trả lời đúng ý bạn về việc này. Bạn gọi hotline ${SITE.phoneDisplay} hoặc nhắn Zalo để được nhân viên P-Home tư vấn trực tiếp nhé!`;
}

export default function ConsultChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = findReply(trimmed);
    setMessages((m) => [...m, { role: "user", text: trimmed }, { role: "bot", text: reply }]);
    setInput("");
  }

  return (
    <>
      {/* Nút mở chat */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Đóng tư vấn" : "Mở tư vấn khách hàng"}
        className="fixed bottom-24 right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-110 sm:bottom-28"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-[9.5rem] right-3 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl border border-line bg-white shadow-2xl sm:bottom-[10.5rem]">
          {/* Header */}
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">Tư vấn P-Home</p>
              <p className="text-[11px] text-white/80">Thường trả lời ngay</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tin nhắn */}
          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-soft px-3 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user" ? "bg-brand text-white" : "border border-line bg-white text-ink"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}

            {/* Gợi ý nhanh */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {FAQS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => send(f.label)}
                  className="rounded-full border border-brand/40 px-2.5 py-1 text-[11px] font-medium text-brand hover:bg-brand hover:text-white"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Liên hệ nhanh */}
          <div className="flex items-center gap-2 border-t border-line px-3 py-1.5 text-[11px]">
            <a href={`tel:${SITE.phone}`} className="font-bold text-hot hover:underline">
              Gọi {SITE.phoneDisplay}
            </a>
            <span className="text-line">•</span>
            <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className="font-bold text-[#0068ff] hover:underline">
              Chat Zalo
            </a>
          </div>

          {/* Nhập liệu */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-line p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 rounded-full border border-line px-3 py-2 text-[13px] outline-none focus:border-brand"
            />
            <button
              type="submit"
              aria-label="Gửi"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-50"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
