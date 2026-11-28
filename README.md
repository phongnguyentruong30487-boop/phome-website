# Nội thất P-Home — website (noithatphome.net)

Website của Công ty TNHH Trang trí Nội thất P-Home, viết bằng Next.js 16 (App Router), React 19, Tailwind CSS 4 và framer-motion. Web được **xuất tĩnh** (HTML/CSS/JS) để chạy trên shared hosting, không cần Node.js.

## Chạy trên máy

```bash
npm install
npm run dev -- --webpack   # http://localhost:3000
```

Dùng `--webpack` vì Turbopack đang bị lỗi "Next.js package not found" khi tự tải lại trang trên máy Windows của dự án.

## Build và đưa lên hosting

```bash
npm run build
```

Kết quả nằm trong thư mục **`out/`**. Upload **toàn bộ nội dung bên trong `out/`** (không phải chính thư mục `out`) vào thư mục gốc của tên miền trên hosting, thường là `public_html/`. Nhớ upload cả file ẩn `.htaccess` (cấu hình trang 404 và bộ nhớ đệm cho Apache/LiteSpeed).

Xem thử bản tĩnh trên máy trước khi upload:

```bash
npx serve out
```

Cấu hình xuất tĩnh nằm trong `next.config.ts`: `output: "export"`, `trailingSlash: true` (mỗi trang là `thu-muc/index.html`), `images.unoptimized: true` (dùng ảnh gốc). Trang tìm kiếm lọc sản phẩm ngay trên trình duyệt.

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `app/` | Các trang: trang chủ, `san-pham`, `danh-muc/[slug]`, `gioi-thieu`, `lien-he`, `tin-tuc`, `chinh-sach/[slug]`, `tim-kiem` |
| `src/components/` | Header, Footer, thẻ sản phẩm, slider, form… |
| `src/lib/site.ts` | **Thông tin liên hệ** (hotline, email, địa chỉ, Facebook, Zalo), menu, cam kết, quy trình đặt hàng |
| `src/lib/data.ts` | Hàm đọc dữ liệu sản phẩm/bài viết |
| `src/data/*.json` | Dữ liệu sản phẩm, danh mục, bài viết, chính sách (tạo bởi script bên dưới) |
| `public/images/` | Logo, slider, banner, ảnh sản phẩm (`sp/`), ảnh bài viết |
| `public/.htaccess` | Cấu hình Apache/LiteSpeed khi chạy trên shared hosting |
| `scripts/extract-old-site.mjs` | Script trích dữ liệu từ bản clone web cũ |

Đổi hotline/email/địa chỉ: sửa `src/lib/site.ts`.

## Trang quản trị kéo-thả (sửa giá / thêm sản phẩm / viết blog)

Xem `tools/admin/README.md` — công cụ chạy trên máy, không cần biết code, để sửa giá,
thêm/sửa/xoá sản phẩm, quản lý danh mục và viết bài blog bằng giao diện kéo-thả.

## Cập nhật dữ liệu từ web cũ

Bản clone web cũ (`raw-clone/`) **không nằm trong git**. Script mặc định tìm nó ở `../raw-clone/raw-clone/noithatphome.com`, hoặc chỉ định bằng biến `RAW_CLONE_DIR`:

```bash
npm run extract
```

Script ghi đè `src/data/*.json`, chép ảnh còn thiếu và xoá ảnh không còn dùng trong `public/images/`. Mọi chỉnh sửa nội dung nằm trong script nên chạy lại vẫn giữ nguyên:

- bỏ phần thừa của nền tảng cũ (chân trang, popup giỏ hàng, bình luận, sidebar); script **dừng báo lỗi** nếu nội dung còn chữ như "Sapo", "giỏ hàng", "bình luận"…
- đổi tên miền `noithatphome.com` → `noithatphome.net`
- trang Hướng dẫn thanh toán chỉ còn thanh toán khi nhận hàng hoặc chuyển khoản; email liên hệ `kientruc.p.home@gmail.com`

## Chatbot AI tư vấn

Nút "Tư vấn" góc phải dưới: chatbot Claude AI tư vấn tủ bếp/tủ áo MDF và thu số điện thoại khách vào Google Sheet.
Phần máy chủ là Cloudflare Worker nhỏ trong `worker/` (chỉ chạy cho `/api/*`). Cài đặt khoá API và Google Sheet: xem `tools/chatbot/HUONG-DAN.md`.

## Lưu ý

- Web chưa có backend: nút “Mua ngay” và form liên hệ mở ứng dụng email của khách với nội dung điền sẵn, gửi tới email trong `src/lib/site.ts`.
