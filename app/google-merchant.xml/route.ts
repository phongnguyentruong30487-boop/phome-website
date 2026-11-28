import { categories, products } from "@/lib/data";

// Route tĩnh (sinh lúc build) — cần cho output: "export"
export const dynamic = "force-static";

const BASE = "https://noithatphome.net";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(s: string) {
  return `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "";

/**
 * Feed sản phẩm cho Google Merchant Center (định dạng RSS 2.0 + namespace g:)
 * https://support.google.com/merchants/answer/7052112
 *
 * Bỏ qua sản phẩm chưa có giá niêm yết (giá 0/trống — loại "liên hệ báo giá")
 * vì Google Merchant bắt buộc phải có giá cụ thể.
 */
export async function GET() {
  const items = products
    .filter((p) => p.price > 0 && p.images.length > 0)
    .map((p) => {
      const link = `${BASE}/san-pham/${p.slug}/`;
      const imageLink = `${BASE}${p.images[0]}`;
      const extraImages = p.images
        .slice(1, 10)
        .map((img) => `      <g:additional_image_link>${BASE}${img}</g:additional_image_link>`)
        .join("\n");
      const description = escapeXml(p.description.join(" ").replace(/\s+/g, " ").trim().slice(0, 5000));
      const hasDiscount = p.oldPrice > p.price;

      return `    <item>
      <g:id>${escapeXml(p.sku || p.slug)}</g:id>
      <title>${cdata(p.name)}</title>
      <description>${cdata(description)}</description>
      <link>${link}</link>
      <g:image_link>${imageLink}</g:image_link>
${extraImages}
      <g:availability>in stock</g:availability>
      <g:price>${hasDiscount ? p.oldPrice : p.price} VND</g:price>${
        hasDiscount ? `\n      <g:sale_price>${p.price} VND</g:sale_price>` : ""
      }
      <g:brand>P-Home</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>Home &amp; Garden &gt; Decor &gt; Furniture</g:google_product_category>
      <g:product_type>${cdata(catName(p.category))}</g:product_type>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>P-Home - Nội thất</title>
    <link>${BASE}</link>
    <description>Sản phẩm nội thất P-Home: tủ quần áo, tủ bếp, tủ giày, giường ngủ, kệ trang trí...</description>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
