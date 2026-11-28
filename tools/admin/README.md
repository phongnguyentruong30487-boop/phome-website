# Trang quản trị kéo-thả (sửa giá / thêm sản phẩm / viết blog)

Đây là một công cụ **chạy hoàn toàn trên máy bạn** (không có server, không gửi gì lên
internet). Nó mở trực tiếp các file dữ liệu trong `src/data/*.json` và ảnh trong
`public/images/`, cho bạn chỉnh sửa bằng giao diện kéo-thả, rồi lưu thẳng vào file —
sau đó bạn build và upload như quy trình cũ trong README chính của repo.

## Yêu cầu

- Trình duyệt **Google Chrome** hoặc **Microsoft Edge** (bản mới). Firefox/Safari
  **không hỗ trợ** (thiếu File System Access API).
- Phải mở trang qua một máy chủ cục bộ (`http://localhost:...`), **không** mở bằng
  cách bấm đúp vào file `index.html` (một số trình duyệt chặn tính năng đọc/ghi file
  khi mở kiểu `file://`).

## Cách chạy

Trong thư mục gốc của repo (nơi có `package.json`):

```bash
npx serve tools/admin
```

Rồi mở địa chỉ mà lệnh trên in ra (thường là `http://localhost:3000`) bằng Chrome/Edge.

(Nếu chưa cài gì cả cũng không sao — `npx serve` sẽ tự tải công cụ `serve` lần đầu chạy.)

## Cách dùng

1. Bấm **"Chọn thư mục dự án"** ở góc trên, rồi chọn đúng thư mục gốc của repo
   `phome-website` trên máy bạn (thư mục chứa `package.json`, `src/`, `public/`…).
   Trình duyệt sẽ hỏi xác nhận quyền đọc/ghi — bấm **Cho phép**.
2. Ba tab:
   - **Sản phẩm**: sửa giá ngay trên dòng thu gọn; bấm mũi tên ▸ để mở rộng và sửa
     tên, mã SKU, danh mục, ảnh, thông số kỹ thuật, mô tả. Kéo biểu tượng ⠿ để đổi
     thứ tự hiển thị trên web.
   - **Danh mục**: thêm/sửa/xoá danh mục sản phẩm, kéo để đổi thứ tự.
   - **Tin tức / Blog**: viết bài mới theo từng "đoạn" (tiêu đề lớn, tiêu đề nhỏ,
     đoạn văn) — kéo để sắp xếp lại thứ tự đoạn, chọn ảnh đại diện trực tiếp từ máy.
3. Mỗi tab có nút **💾 Lưu** riêng — nhớ bấm lưu sau khi sửa xong tab nào thì file
   `.json` tương ứng trong `src/data/` sẽ được ghi đè ngay trên máy bạn. Chữ
   "● có thay đổi chưa lưu" nhắc bạn nếu quên lưu.
4. Ảnh được thêm qua nút "Thêm ảnh" / "Chọn ảnh" sẽ được **copy thẳng** vào đúng thư
   mục `public/images/...` tương ứng — không cần tự tay copy file.

## Sau khi chỉnh sửa xong

Quay lại quy trình trong README chính của repo:

```bash
npm run build     # xuất ra thư mục out/
```

Rồi upload nội dung bên trong `out/` lên hosting như bình thường. Đừng quên
`git add` + `git commit` + `git push` các file đã đổi trong `src/data/`,
`public/images/` và thư mục `tools/admin/` (nếu đây là lần đầu thêm công cụ này vào
repo), để lần sau clone máy khác vẫn còn dữ liệu và công cụ quản trị.

## Giới hạn hiện tại

- Chỉ chỉnh được sản phẩm, danh mục và bài viết. Thông tin liên hệ, trang giới
  thiệu… vẫn sửa trực tiếp trong `src/lib/site.ts` như trước.
- Không kiểm tra ảnh trùng tên hay dọn ảnh cũ không dùng — nếu xoá sản phẩm/bài viết,
  ảnh cũ vẫn còn nằm trong `public/images/` (không ảnh hưởng gì, chỉ hơi dư file).
- Công cụ không tự chạy `npm run build` hay tự upload — đây vẫn là bước thủ công
  tiếp theo như quy trình cũ.
