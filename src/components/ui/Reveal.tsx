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

/** Hiện dần khi cuộn tới (chạy một lần). */
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
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Lưới/danh sách: chỉ còn là div thường (không animate) — RevealItem bên trong
 * tự hiện dần độc lập, không phụ thuộc việc "truyền" biến thể animation từ cha
 * xuống con (cách cũ dùng variants cha/con đôi khi bị kẹt ở trạng thái ẩn nếu
 * component cha chưa thực sự lọt vào viewport đúng lúc con mount).
 */
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
