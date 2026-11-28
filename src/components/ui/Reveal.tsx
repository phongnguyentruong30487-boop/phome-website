"use client";

import { MotionConfig, motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Direction = "up" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 32 },
  left: { x: -40 },
  right: { x: 40 },
  none: {},
};

/** Bọc toàn trang: tôn trọng cài đặt "giảm chuyển động" của hệ điều hành. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Hiện dần ngay khi vào trang (KHÔNG chờ cuộn tới).
 *
 * Trước đây dùng `whileInView` + `IntersectionObserver` ("chờ cuộn tới mới
 * hiện"). Đã xác minh trên máy thật của khách và trên trình duyệt kiểm thử:
 * có những lúc `IntersectionObserver` của trình duyệt không bắn callback
 * (có thể do tiện ích mở rộng chặn, chế độ tiết kiệm pin, hoặc một số thiết
 * bị/trình duyệt cụ thể) — khi đó phần tử bị kẹt vĩnh viễn ở trạng thái ẩn
 * (opacity: 0), khiến cả trang trông "trống trơn". Với một trang bán hàng,
 * nội dung bắt buộc phải luôn hiện ra được, nên bỏ hẳn việc phụ thuộc vào sự
 * kiện cuộn — chuyển sang hiệu ứng hiện dần ngay khi component được tải lên
 * trang (mount), không phụ thuộc bất kỳ API trình duyệt nào có thể bị chặn.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: Direction;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset[from] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Lưới/danh sách: chỉ là div thường — RevealItem bên trong tự hiện dần. */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
