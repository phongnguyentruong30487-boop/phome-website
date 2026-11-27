import type { MetadataRoute } from "next";
import { categories, policies, posts, products } from "@/lib/data";

// Cần cho output: "export" – tạo sitemap.xml tĩnh lúc build
export const dynamic = "force-static";

const BASE = "https://noithatphome.net";

export default function sitemap(): MetadataRoute.Sitemap {
  // Có dấu "/" ở cuối cho khớp với trailingSlash: true
  const paths = [
    "/",
    "/gioi-thieu/",
    "/san-pham/",
    "/lien-he/",
    "/tin-tuc/",
    ...categories.map((c) => `/danh-muc/${c.slug}/`),
    ...products.map((p) => `/san-pham/${p.slug}/`),
    ...posts.map((p) => `/tin-tuc/${p.slug}/`),
    ...policies.map((p) => `/chinh-sach/${p.slug}/`),
  ];
  return paths.map((path) => ({ url: BASE + path }));
}
