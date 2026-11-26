import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Chọn số tiến trình build theo RAM còn trống thay vì theo số nhân CPU.
    // Máy phát triển chỉ có ~4GB RAM: 7 tiến trình song song làm build bị "out of memory".
    memoryBasedWorkersCount: true,
  },
};

export default nextConfig;
