// Hàm định dạng dùng chung cho cả server và client (không import dữ liệu JSON)
export const formatPrice = (n: number) =>
  n > 0 ? n.toLocaleString("vi-VN").replace(/,/g, ".") + "₫" : "Liên hệ";

/** Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu */
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

/** Lọc danh sách theo từ khoá: mọi từ đều phải xuất hiện (không phân biệt dấu) */
export const matchAll = <T>(items: T[], q: string, text: (x: T) => string) => {
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return items.filter((x) => {
    const hay = normalize(text(x));
    return terms.every((t) => hay.includes(t));
  });
};
