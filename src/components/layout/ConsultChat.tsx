"use client";

import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Headset, MessageCircle, Phone, Send, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { ZaloIcon } from "@/components/ui/BrandIcons";

type Message = {
  role: "bot" | "user";
  text: string;
};

type Faq = {
  keywords: string[];
  reply: string;
};

/**
 * Chatbot tư vấn P-Home.
 * - Câu trả lời do Claude AI tạo qua /api/chat (Cloudflare Worker, xem worker/index.ts).
 * - Khi AI lỗi / chưa cấu hình (vd. chạy `npm run dev`), tự quay về trả lời theo từ khoá bên dưới.
 * - Form để lại SĐT gửi về /api/lead → Google Sheet.
 */
const FAQS: Faq[] = [
  {
    keywords: ["giao hang", "ship", "van chuyen", "lap dat", "bao lau"],
    reply:
      "P-Home miễn phí giao hàng & lắp đặt tại TP. HCM, TP. Thủ Đức, Dĩ An, Thuận An trong vòng 3 ngày làm việc (9h-16h, thứ Hai - thứ Bảy). Một số khu vực xa hơn ở Bình Dương sẽ có phụ phí. Xem chi tiết tại trang Chính sách giao hàng & lắp đặt.",
  },
  {
    keywords: ["bao hanh", "bao tri", "hu hong", "loi san pham"],
    reply:
      "Sản phẩm P-Home được bảo hành 2 năm kể từ ngày giao hàng thành công đối với lỗi chất liệu, kỹ thuật và lắp đặt từ phía P-Home. Chi tiết tại trang Chính sách bảo hành & bảo trì.",
  },
  {
    keywords: ["doi tra", "tra hang", "doi hang", "hoan tien"],
    reply:
      "Trong vòng 3 ngày kể từ khi nhận hàng, bạn được đổi sản phẩm miễn phí nếu sản phẩm lỗi do P-Home. Việc trả hàng tại thời điểm giao hàng (đặt nhầm/đổi ý) sẽ tính phí vận chuyển & lắp đặt. Chi tiết tại trang Chính sách đổi trả.",
  },
  {
    keywords: ["thanh toan", "tra gop", "chuyen khoan", "coc", "tien mat"],
    reply:
      "P-Home nhận thanh toán tiền mặt khi giao hàng hoặc chuyển khoản ngân hàng. Với đơn hàng đồ gỗ, có thể thanh toán trước 50% khi đặt, phần còn lại thanh toán khi nhận hàng. Hiện P-Home chưa hỗ trợ trả góp.",
  },
  {
    keywords: ["dia chi", "showroom", "cua hang", "xuong", "o dau", "gio mo cua", "lien he"],
    reply: `P-Home ở ${SITE.address}. Hotline: ${SITE.phoneDisplay}, Email: ${SITE.email}. Anh/chị có thể gọi hoặc nhắn Zalo để được hướng dẫn đường đi chi tiết.`,
  },
  {
    keywords: ["tu bep", "bep"],
    reply:
      "P-Home sản xuất tủ bếp MDF chống ẩm, phủ Melamine / Laminate / Acrylic, đo đạc & thi công theo kích thước thực tế (bếp chữ I, L, U). Xem mẫu tại https://noithatphome.net/danh-muc/tu-bep/ — để lại số điện thoại để kiến trúc sư P-Home báo giá chính xác nhé.",
  },
  {
    keywords: ["tu ao", "tu quan ao", "tu do"],
    reply:
      "P-Home có tủ áo MDF cánh mở và cánh lùa, nhiều kích thước (0.6m – 1.8m) và nhận đóng theo kích thước phòng. Xem mẫu tại https://noithatphome.net/danh-muc/tu-ao/ — để lại số điện thoại để được tư vấn chi tiết nhé.",
  },
  {
    keywords: ["gia", "bao gia", "chiet khau", "giam gia"],
    reply:
      "Giá niêm yết có trên từng sản phẩm. Với tủ bếp, tủ áo đóng theo kích thước, giá phụ thuộc kích thước, vật liệu và phụ kiện — anh/chị để lại số điện thoại để P-Home báo giá chính xác nhé.",
  },
];

const QUICK = [
  { label: "Tủ bếp MDF", text: "Tôi muốn tư vấn tủ bếp MDF" },
  { label: "Tủ áo MDF", text: "Tôi muốn tư vấn tủ áo MDF" },
  { label: "Vật liệu & màu sắc", text: "Tư vấn giúp tôi về vật liệu và màu sắc tủ" },
  { label: "Phụ kiện", text: "Tủ bên P-Home dùng phụ kiện gì?" },
  { label: "Nhận báo giá", text: "Tôi muốn nhận báo giá" },
];

const GREETING: Message = {
  role: "bot",
  text: "Chào anh/chị 👋 Em là trợ lý tư vấn của **Nội thất P-Home** — xưởng sản xuất trực tiếp tủ bếp, tủ áo MDF giá tốt. Anh/chị đang quan tâm sản phẩm nào ạ?",
};

const FALLBACK_TEXT = `Em chưa chắc trả lời đúng ý anh/chị về việc này. Anh/chị gọi hotline ${SITE.phoneDisplay}, nhắn Zalo hoặc để lại số điện thoại để nhân viên P-Home tư vấn trực tiếp nhé!`;

function stripAccents(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function faqReply(input: string): string {
  const q = stripAccents(input);
  return FAQS.find((f) => f.keywords.some((kw) => q.includes(kw)))?.reply ?? FALLBACK_TEXT;
}

const PHONE_RE = /(?:\+?84|0)[\s.]?[35789](?:[\s.]?\d){8}/;

/** Hiển thị **đậm** và đường link trong tin nhắn (link nội bộ mở trong cùng tab) */
function renderText(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^https?:\/\//.test(part)) {
      const url = part.replace(/[.,;:!?]+$/, "");
      const tail = part.slice(url.length);
      const internal = /^https?:\/\/(www\.)?noithatphome\.net/.test(url);
      const href = internal ? url.replace(/^https?:\/\/(www\.)?noithatphome\.net/, "") || "/" : url;
      return (
        <Fragment key={i}>
          <a
            href={href}
            {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="break-all font-medium text-brand underline"
          >
            {internal ? (href.startsWith("/san-pham/") && href !== "/san-pham/" ? "Xem sản phẩm" : "Xem mẫu") : url}
          </a>
          {tail}
        </Fragment>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const fieldCls = "w-full rounded-md border border-line bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-brand";

export default function ConsultChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadPhone, setLeadPhone] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [showStaff, setShowStaff] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading, showLead, showStaff]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const history: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(history);
    setInput("");
    setShowStaff(false);

    // Khách tự gõ số điện thoại → mở sẵn form để xác nhận
    const phone = trimmed.match(PHONE_RE)?.[0];
    if (phone && leadStatus !== "done") {
      setLeadPhone(phone.replace(/[\s.]/g, ""));
      setShowLead(true);
    }

    setLoading(true);
    let reply = "";
    let wantsLead = false;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((m) => m !== GREETING)
            .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; lead?: boolean; error?: string };
      if (res.ok && data.reply) {
        reply = data.reply;
        wantsLead = !!data.lead;
      } else if (data.error === "rate_limited" || data.error === "busy") {
        reply = `Hiện có nhiều khách đang hỏi cùng lúc, anh/chị thử lại sau ít phút hoặc gọi ${SITE.phoneDisplay} giúp em nhé.`;
      }
    } catch {
      // mất mạng / chạy trên máy không có Worker → dùng trả lời dựng sẵn
    }
    if (!reply) {
      reply = faqReply(trimmed);
      wantsLead = /bao gia|tu van|goi lai|nhan vien/.test(stripAccents(trimmed));
    }
    setMessages((m) => [...m, { role: "bot", text: reply }]);
    if (wantsLead && leadStatus !== "done") setShowLead(true);
    setLoading(false);
  }

  async function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    const need = String(f.get("need") ?? "").trim();
    const normalized = phone.replace(/[\s.\-()]/g, "").replace(/^\+?84/, "0");
    if (!/^0[35789]\d{8}$/.test(normalized)) {
      setLeadStatus("error");
      return;
    }
    setLeadStatus("sending");
    const transcript = messages
      .filter((m) => m !== GREETING)
      .map((m) => `${m.role === "user" ? "Khách" : "Bot"}: ${m.text}`)
      .join("\n");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone: normalized, need, transcript, page: window.location.href }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setLeadStatus("done");
      setShowLead(false);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `Cảm ơn ${name || "anh/chị"}! P-Home đã nhận thông tin, nhân viên sẽ gọi lại số **${normalized}** trong giờ làm việc sớm nhất. Cần gấp anh/chị gọi ${SITE.phoneDisplay} nhé.`,
        },
      ]);
    } catch {
      setLeadStatus("idle");
      setShowLead(false);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `Xin lỗi, hệ thống chưa gửi được thông tin. Anh/chị vui lòng gọi ${SITE.phoneDisplay} hoặc nhắn Zalo để P-Home hỗ trợ ngay nhé.`,
        },
      ]);
      setShowStaff(true);
    }
  }

  return (
    <>
      {/* Nút mở chat — đặt cạnh cột Facebook/Zalo/Maps để không che nhau */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Đóng tư vấn" : "Mở tư vấn khách hàng"}
        aria-expanded={open}
        className="fixed bottom-4 right-[4.25rem] z-50 flex h-12 items-center gap-2 rounded-full bg-brand pl-3 pr-3 text-white shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 sm:pr-4"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        <span className="hidden text-[14px] font-bold sm:inline">{open ? "Đóng" : "Tư vấn"}</span>
        {!open && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-hot" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Tư vấn P-Home"
          className="fixed bottom-20 left-3 right-3 z-50 flex h-[min(34rem,calc(100dvh-6.5rem))] flex-col overflow-hidden rounded-xl border border-line bg-white shadow-2xl sm:left-auto sm:w-[23rem]"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">Tư vấn Nội thất P-Home</p>
              <p className="text-[11px] text-white/80">Tủ bếp • Tủ áo MDF • Giá tại xưởng</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tin nhắn */}
          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-soft px-3 py-3" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user" ? "bg-brand text-white" : "border border-line bg-white text-ink"
                  }`}
                >
                  {m.role === "bot" ? renderText(m.text) : m.text}
                </p>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start" aria-label="P-Home đang trả lời">
                <span className="flex gap-1 rounded-2xl border border-line bg-white px-3 py-3">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </span>
              </div>
            )}

            {/* Gợi ý nhanh (chỉ hiện khi mới mở) */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => send(q.text)}
                    className="rounded-full border border-brand/40 bg-white px-2.5 py-1 text-[12px] font-medium text-brand hover:bg-brand hover:text-white"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            {/* Form để lại số điện thoại */}
            {showLead && leadStatus !== "done" && (
              <form onSubmit={submitLead} className="space-y-2 rounded-xl border border-brand/40 bg-white p-3">
                <p className="text-[13px] font-bold text-brand">Để lại SĐT – P-Home gọi lại tư vấn & báo giá</p>
                <input name="name" placeholder="Tên anh/chị" autoComplete="name" maxLength={100} className={fieldCls} />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Số điện thoại *"
                  autoComplete="tel"
                  defaultValue={leadPhone}
                  key={leadPhone}
                  maxLength={20}
                  className={fieldCls}
                />
                <input name="need" placeholder="Nhu cầu (vd: tủ bếp chữ L 3m)" maxLength={500} className={fieldCls} />
                {leadStatus === "error" && <p className="text-[12px] text-hot">Số điện thoại chưa đúng (10 số, vd 0934 787 123).</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={leadStatus === "sending"}
                    className="flex-1 rounded-md bg-brand py-1.5 text-[13px] font-bold text-white hover:bg-brand-dark disabled:opacity-60"
                  >
                    {leadStatus === "sending" ? "Đang gửi..." : "Gửi thông tin"}
                  </button>
                  <button type="button" onClick={() => setShowLead(false)} className="rounded-md border border-line px-3 text-[13px] text-gray-600">
                    Để sau
                  </button>
                </div>
              </form>
            )}

            {/* Kết nối nhân viên */}
            {showStaff && (
              <div className="space-y-1.5 rounded-xl border border-line bg-white p-3 text-[13px]">
                <p className="font-bold text-ink">Kết nối nhân viên P-Home</p>
                <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 font-bold text-hot hover:underline">
                  <Phone className="h-4 w-4" /> Gọi {SITE.phoneDisplay}
                </a>
                <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-bold text-[#0068ff] hover:underline">
                  <ZaloIcon className="h-5 w-5" /> Nhắn Zalo
                </a>
                {leadStatus !== "done" && !showLead && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowStaff(false);
                      setShowLead(true);
                    }}
                    className="font-bold text-brand hover:underline"
                  >
                    Để lại SĐT, nhân viên gọi lại
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Nút kết nối nhân viên */}
          <div className="flex items-center gap-2 border-t border-line px-3 py-1.5 text-[12px]">
            <button
              type="button"
              onClick={() => setShowStaff((v) => !v)}
              className="flex items-center gap-1 font-bold text-brand hover:underline"
            >
              <Headset className="h-4 w-4" /> Gặp nhân viên P-Home
            </button>
            <span className="text-line">•</span>
            <a href={`tel:${SITE.phone}`} className="font-bold text-hot hover:underline">
              {SITE.phoneDisplay}
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
              placeholder="Nhập câu hỏi của anh/chị..."
              maxLength={1000}
              aria-label="Nội dung tin nhắn"
              className="flex-1 rounded-full border border-line px-3 py-2 text-[13px] outline-none focus:border-brand"
            />
            <button
              type="submit"
              aria-label="Gửi"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-50"
              disabled={!input.trim() || loading}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
