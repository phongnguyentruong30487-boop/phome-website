import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Xuất web tĩnh (HTML/CSS/JS) vào thư mục out/ để upload lên shared hosting, không cần Node.js
  output: "export",
  // /san-pham/abc → /san-pham/abc/index.html: Apache/LiteSpeed phục vụ trực tiếp, không cần rewrite
  trailingSlash: true,
  images: {
    // Hosting tĩnh không có server tối ưu ảnh của Next.js → dùng ảnh gốc
    unoptimized: true,
  },
  experimental: {
    // Chọn số tiến trình build theo RAM còn trống thay vì theo số nhân CPU.
    // Máy phát triển chỉ có ~4GB RAM: 7 tiến trình song song làm build bị "out of memory".
    memoryBasedWorkersCount: true,
  },
};

export default nextConfig;
