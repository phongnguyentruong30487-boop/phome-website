# Chatbot AI tư vấn P-Home — hướng dẫn cài đặt

## Cách hoạt động

```
Khách chat trên web ──► /api/chat ──► Claude AI (Sonnet 5.5) ──► trả lời tư vấn
Khách để lại SĐT   ──► /api/lead ──► Google Apps Script ──► Google Sheet "Lead chatbot"
```

- Giao diện: `src/components/layout/ConsultChat.tsx`
- Máy chủ (Cloudflare Worker): `worker/index.ts` — chỉ chạy cho đường dẫn `/api/*`, các trang khác vẫn là web tĩnh như cũ.
- Kiến thức tư vấn (vật liệu, màu, phụ kiện, cách hỏi khách): `worker/prompt.ts`. Danh sách tủ bếp / tủ áo tự lấy từ `src/data/products.json`.
- Nếu AI lỗi hoặc chưa cấu hình, chatbot tự trả lời theo câu hỏi thường gặp và hướng khách gọi hotline/Zalo — web không bị ảnh hưởng.

## Bước 1 — Lấy khoá Claude API

1. Vào https://console.anthropic.com → đăng nhập → **Billing**: nạp tiền (trả trước).
2. **API Keys** → **Create Key** → đặt tên `phome-chatbot` → sao chép khoá (bắt đầu bằng `sk-ant-`).
3. Nên đặt giới hạn chi tiêu tháng trong **Limits** để kiểm soát chi phí.

## Bước 2 — Tạo Google Sheet nhận lead

1. Tạo một Google Sheet mới, ví dụ "P-Home – Khách từ chatbot".
2. Menu **Tiện ích mở rộng → Apps Script**. Xoá code mẫu, dán toàn bộ nội dung file `tools/chatbot/google-sheet-apps-script.gs`.
3. Sửa dòng `const SECRET = "DOI-CHUOI-BI-MAT-NAY";` thành một chuỗi bí mật dài (vd 30 ký tự ngẫu nhiên). Lưu.
4. **Triển khai → Tùy chọn triển khai mới** → loại **Ứng dụng web**:
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
5. Bấm Triển khai, cấp quyền, sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).

> Khi sửa code Apps Script sau này: **Triển khai → Quản lý triển khai → sửa (bút chì) → Phiên bản mới**, để URL giữ nguyên.

## Bước 3 — Khai báo biến trên Cloudflare

Cloudflare Dashboard → **Workers & Pages** → `phome-website` → **Settings → Variables and Secrets** → **Add** (chọn loại **Secret**):

| Tên | Giá trị |
|---|---|
| `ANTHROPIC_API_KEY` | khoá `sk-ant-...` ở Bước 1 |
| `SHEET_WEBHOOK_URL` | URL ứng dụng web ở Bước 2 |
| `SHEET_SECRET` | chuỗi bí mật đã đặt trong Apps Script |
| `CHAT_MODEL` *(không bắt buộc, loại Text)* | mặc định `claude-sonnet-5-5`; muốn rẻ hơn đổi thành `claude-haiku-5-5` |

Sau đó deploy lại như bình thường (`tools/cap-nhat-len-web.bat`).

## Chạy thử trên máy

`npm run dev` chỉ chạy giao diện — chatbot sẽ dùng chế độ trả lời dựng sẵn (không có AI). Muốn thử đủ AI + Sheet trên máy:

1. Tạo file `.dev.vars` (đã được git bỏ qua) trong thư mục `nextjs-app`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
   SHEET_SECRET=chuoi-bi-mat
   ```
2. `npm run build` rồi `npx wrangler dev` → mở http://localhost:8787

## Chỉnh nội dung tư vấn

Sửa `worker/prompt.ts` (phần "Kiến thức tư vấn" và "Cách tư vấn"), rồi deploy lại. Ví dụ thêm chương trình khuyến mãi, đổi cách xưng hô, thêm vật liệu mới.

## Bản đồ sửa chatbot (muốn đổi gì → sửa file nào)

| Muốn đổi | File | Ghi chú |
|---|---|---|
| Kiến thức tư vấn: vật liệu, màu, phụ kiện, kích thước, chính sách | `worker/prompt.ts` → mục "Kiến thức tư vấn" / "Về P-Home" | Hotline, địa chỉ, email lấy từ `src/lib/site.ts` |
| Cách bot nói chuyện: xưng hô, độ dài, khi nào xin SĐT | `worker/prompt.ts` → mục "Cách tư vấn" | `[[LEAD]]` = bot báo hiện form SĐT; `[[SP:n]]` = link sản phẩm |
| Sản phẩm / giá bot giới thiệu | Không cần sửa chatbot — sửa bằng trang quản trị (`src/data/products.json`) | Bot đang dùng danh mục `tu-bep`, `tu-ao` (biến `CHAT_PRODUCTS` trong `worker/prompt.ts`) |
| Câu chào, nút gợi ý nhanh | `src/components/layout/ConsultChat.tsx` → `GREETING`, `QUICK` | |
| Câu trả lời dự phòng khi AI lỗi | `ConsultChat.tsx` → `FAQS` | Dùng khi chưa có khoá / AI lỗi / chạy `npm run dev` |
| Giao diện: màu, vị trí nút, kích thước khung | `ConsultChat.tsx` (class Tailwind) | Màu thương hiệu ở `app/globals.css` (`brand`, `hot`) |
| Form để lại SĐT (thêm ô, đổi chữ) | `ConsultChat.tsx` → form `submitLead`; `worker/index.ts` → `handleLead`; Apps Script → `appendRow` | Thêm cột mới phải sửa cả 3 chỗ |
| Đổi model AI | Cloudflare biến `CHAT_MODEL` (không cần sửa code) | Mặc định `claude-sonnet-5-5` trong `worker/index.ts` |
| Độ "suy nghĩ" / độ dài trả lời | `worker/index.ts` → `output_config.effort`, `max_tokens` | |
| Giới hạn lượt hỏi | `wrangler.jsonc` → `ratelimits` | |
| Tên miền được phép gọi API | `worker/index.ts` → `ALLOWED_HOSTS` | |

### Kiểm tra sau khi sửa (trước khi đẩy lên web)

```bash
npx eslint src/components/layout/ConsultChat.tsx worker/
npx tsc -p worker/tsconfig.json          # kiểm tra code Worker
npm run build                             # kiểm tra web build được
npx wrangler@4 deploy --dry-run           # kiểm tra Worker đóng gói được (không deploy)
```

Sau đó commit và `git push` → Cloudflare tự build & deploy (2–5 phút). Kiểm tra web thật:
`/api/chat` trả `{"error":"not_configured"}` nghĩa là Worker chạy nhưng thiếu khoá; trả `{"reply":…}` là AI đang chạy.

## Chống lạm dụng & chi phí

- Mỗi IP tối đa 20 lượt / phút (`ratelimits` trong `wrangler.jsonc`).
- Chỉ nhận request từ chính tên miền noithatphome.net.
- Mỗi tin nhắn tối đa 1.500 ký tự, mỗi lần gửi tối đa 24 tin gần nhất.
- Theo dõi chi phí tại console.anthropic.com → **Usage**.
