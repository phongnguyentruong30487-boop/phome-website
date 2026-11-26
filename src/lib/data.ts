import productsJson from "@/data/products.json";
import categoriesJson from "@/data/categories.json";
import postsJson from "@/data/posts.json";
import policiesJson from "@/data/policies.json";
import siteJson from "@/data/site.json";

export type Spec = { label: string; value: string };
export type Product = {
  slug: string;
  name: string;
  sku: string;
  price: number;
  oldPrice: number;
  category: string;
  images: string[];
  specs: Spec[];
  description: string[];
};
export type Category = { slug: string; name: string };
export type Post = {
  slug: string;
  title: string;
  date: string;
  cover: string | null;
  excerpt: string;
  body: string;
};
export type Policy = { slug: string; title: string; body: string };

export const products = productsJson as Product[];
export const categories = categoriesJson as Category[];
export const posts = postsJson as Post[];
export const policies = policiesJson as Policy[];
export const aboutHtml = siteJson.aboutHtml;
export const mapSrc = siteJson.mapSrc;

/** Ảnh banner riêng cho một số danh mục, còn lại dùng banner chung */
export type Banner = { src: string; width: number; height: number };
const DEFAULT_BANNER: Banner = { src: "/images/banner/cong-ty.png", width: 1200, height: 300 };
const CATEGORY_BANNER: Record<string, Banner> = {
  "ke-sat-trang-tri": { src: "/images/banner/ke-trang-tri.jpg", width: 1200, height: 350 },
  "tu-bep": { src: "/images/banner/tu-bep.jpg", width: 1200, height: 400 },
};
export const categoryBanner = (slug?: string): Banner => (slug && CATEGORY_BANNER[slug]) || DEFAULT_BANNER;

export { formatPrice } from "./format";

export const discountPercent = (p: Product) =>
  p.oldPrice > p.price && p.price > 0
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : 0;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsIn = (slug: string) => products.filter((p) => p.category === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const getPolicy = (slug: string) => policies.find((p) => p.slug === slug);

/** Ảnh đại diện bài viết: ảnh đầu tiên trong bài, nếu không có thì dùng banner */
export const postCover = (p: Post) => p.cover ?? DEFAULT_BANNER.src;

export const formatDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/** Sản phẩm "hot sale": giảm giá nhiều nhất, tối đa 2 sản phẩm mỗi danh mục cho đa dạng */
export const hotSale = (n = 8) => {
  const perCat = new Map<string, number>();
  return products
    .filter((p) => p.oldPrice > p.price && p.price > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .filter((p) => {
      const c = perCat.get(p.category) ?? 0;
      perCat.set(p.category, c + 1);
      return c < 2;
    })
    .slice(0, n);
};
