export const SITE = {
  name: "P-Home",
  company: "CÔNG TY TNHH TRANG TRÍ NỘI THẤT P-HOME",
  slogan:
    "Nội thất P-Home cung cấp kệ lò vi sóng - kệ máy giặt - tủ bếp - giường em bé - kệ trang trí giá cạnh tranh",
  phone: "0934787123",
  phoneDisplay: "0934 787 123",
  email: "kientruc.p.home@gmail.com",
  address: "301/10 KP6, TX14, Thạnh Xuân, Quận 12, Tp HCM",
  facebook: "https://www.facebook.com/tubepgonhua",
  zalo: "https://zalo.me/0934787123",
  maps: "https://www.google.com/maps/place/P-home/@10.8770265,106.6666309,17z/data=!4m6!3m5!1s0x3175297998a9c865:0x72ba505dbe7707f2!8m2!3d10.8770265!4d106.6666309",
};

export const MAIN_NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/san-pham", label: "Sản phẩm", dropdown: "products" as const },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/tin-tuc", label: "Tin tức", dropdown: "posts" as const },
];

/** Các cam kết lấy từ trang chính sách của web cũ */
export const PROMISES = [
  { key: "ship", title: "Miễn phí giao & lắp đặt", desc: "TP. HCM, Thủ Đức, Dĩ An, Thuận An", href: "/chinh-sach/chinh-sach-giao-hang-lap-dat" },
  { key: "warranty", title: "Bảo hành 2 năm", desc: "Tính từ ngày giao hàng", href: "/chinh-sach/chinh-sach-bao-hanh-bao-tri" },
  { key: "return", title: "Đổi hàng trong 3 ngày", desc: "Khi có lỗi từ P-Home", href: "/chinh-sach/chinh-sach-doi-tra" },
  { key: "factory", title: "Sản xuất & thi công", desc: "Trọn gói từ xưởng P-Home", href: "/gioi-thieu" },
] as const;

/** Quy trình đặt hàng hiện tại (web mới không có giỏ hàng/tài khoản) */
export const BUY_STEPS = [
  "Chọn sản phẩm và số lượng, bấm “Mua ngay” để điền thông tin đặt hàng — hoặc gọi hotline 0934 787 123 / nhắn Zalo.",
  "P-Home gọi lại xác nhận đơn hàng, màu sắc, kích thước và lịch giao hàng.",
  "Giao hàng và lắp đặt tận nơi theo lịch đã hẹn (miễn phí tại TP. HCM, TP. Thủ Đức, Dĩ An, Thuận An).",
  "Thanh toán khi nhận hàng hoặc chuyển khoản. Đơn hàng trên 10.000.000₫ vui lòng đặt cọc trước theo chính sách bán hàng.",
];

export const FOOTER_GUIDE = [
  { href: "/chinh-sach/huong-dan", label: "Hướng dẫn mua hàng" },
  { href: "/chinh-sach/quy-dinh-thanh-toan", label: "Hướng dẫn thanh toán" },
  { href: "/chinh-sach/dieu-khoan", label: "Điều khoản dịch vụ" },
];

export const FOOTER_POLICY = [
  { href: "/chinh-sach/chinh-sach-ban-hang", label: "Chính sách Bán Hàng" },
  { href: "/chinh-sach/chinh-sach-giao-hang-lap-dat", label: "Chính Sách Giao Hàng & Lắp Đặt" },
  { href: "/chinh-sach/chinh-sach-bao-hanh-bao-tri", label: "Chính Sách Bảo Hành & Bảo Trì" },
  { href: "/chinh-sach/chinh-sach-doi-tra", label: "Chính sách đổi trả" },
];
