# Nội thất P-Home — website

Website của Công ty TNHH Trang trí Nội thất P-Home, viết bằng Next.js 16 (App Router), React 19, Tailwind CSS 4 và framer-motion. Giao diện dựa trên web cũ noithatphome.com.

## Chạy trên máy

```bash
npm install
npm run dev -- --webpack   # http://localhost:3000
```

Dùng `--webpack` vì Turbopack đang bị lỗi "Next.js package not found" khi tự tải lại trang trên máy Windows của dự án.

Build bản chạy thật:

```bash
npm run build
npm run start
```

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `app/` | Các trang: trang chủ, `san-pham`, `danh-muc/[slug]`, `gioi-thieu`, `lien-he`, `tin-tuc`, `chinh-sach/[slug]`, `tim-kiem` |
| `src/components/` | Header, Footer, thẻ sản phẩm, slider, form… |
| `src/lib/site.ts` | **Thông tin liên hệ** (hotline, email, địa chỉ, Facebook, Zalo), menu, cam kết, quy trình đặt hàng |
| `src/lib/data.ts` | Hàm đọc dữ liệu sản phẩm/bài viết |
| `src/data/*.json` | Dữ liệu sản phẩm, danh mục, bài viết, chính sách (tạo bởi script bên dưới) |
| `public/images/` | Logo, slider, banner, ảnh sản phẩm (`sp/`), ảnh bài viết |
| `scripts/extract-old-site.mjs` | Script trích dữ liệu từ bản clone web cũ |

Đổi hotline/email/địa chỉ: sửa `src/lib/site.ts`.

## Cập nhật dữ liệu từ web cũ

Bản clone web cũ (`raw-clone/`) **không nằm trong git**. Script mặc định tìm nó ở `../raw-clone/raw-clone/noithatphome.com`, hoặc chỉ định bằng biến `RAW_CLONE_DIR`:

```bash
npm run extract
```

Script ghi đè `src/data/*.json` và chép ảnh còn thiếu vào `public/images/`. Các chỉnh sửa nội dung (ví dụ trang Hướng dẫn thanh toán, email liên hệ) nằm trong script nên chạy lại vẫn giữ nguyên.

## Lưu ý

- Web chưa có backend: nút “Mua ngay” và form liên hệ mở ứng dụng email của khách với nội dung điền sẵn, gửi tới email trong `src/lib/site.ts`.
