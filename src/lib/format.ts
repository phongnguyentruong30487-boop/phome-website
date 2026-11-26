// Hàm định dạng dùng chung cho cả server và client (không import dữ liệu JSON)
export const formatPrice = (n: number) =>
  n > 0 ? n.toLocaleString("vi-VN").replace(/,/g, ".") + "₫" : "Liên hệ";
