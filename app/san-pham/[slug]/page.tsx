import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RefreshCw, ShieldCheck, Truck } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import OrderButton from "@/components/product/OrderButton";
import ProductTabs from "@/components/product/ProductTabs";
import ProductCard, { toCard } from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { discountPercent, formatPrice, getCategory, getProduct, products, productsIn } from "@/lib/data";
import { BUY_STEPS, PROMISES, SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const desc = (p.description[0] || p.specs.map((s) => `${s.label}: ${s.value}`).join(". ")).slice(0, 160);
  return { title: p.name, description: desc, openGraph: { title: p.name, description: desc, images: [p.images[0]] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const off = discountPercent(p);
  const related = productsIn(p.category).filter((x) => x.slug !== p.slug).slice(0, 4).map(toCard);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku || undefined,
    image: p.images,
    brand: { "@type": "Brand", name: "Nội Thất P - Home" },
    ...(p.price > 0 && {
      offers: { "@type": "Offer", priceCurrency: "VND", price: p.price, availability: "https://schema.org/InStock" },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Breadcrumb items={[...(cat ? [{ href: `/danh-muc/${cat.slug}`, label: cat.name }] : []), { label: p.name }]} />

      <div className="container-site pb-16 pt-6">
        <h1 className="text-[20px] font-medium leading-snug text-ink md:text-[24px]">{p.name}</h1>
        <div className="mt-1 flex flex-wrap gap-x-3 text-[12px] text-ink">
          {p.sku && (
            <span>
              SKU: <b className="text-brand">{p.sku}</b>
            </span>
          )}
          <span>
            | Thương hiệu: <b className="text-brand">Nội Thất P - Home</b>
          </span>
        </div>

        <div className="mt-4 grid gap-6 border-t border-line pt-4 md:grid-cols-2">
          <ProductGallery images={p.images} name={p.name} />

          <div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-[24px] font-medium text-hot">{formatPrice(p.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-[15px] text-gray-400 line-through">{formatPrice(p.oldPrice)}</span>
                  <span className="rounded-sm bg-hot px-1.5 py-0.5 text-[12px] font-bold text-white">-{off}%</span>
                </>
              )}
            </div>
            <p className="mt-1 text-[14px]">
              Tình trạng: <span className="text-brand">Còn hàng</span>
            </p>

            {p.specs.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-y border-line py-3 text-[14px]">
                {p.specs.slice(0, 6).map((s) => (
                  <li key={s.label}>
                    <b className="text-ink">{s.label}:</b> {s.value}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5">
              <OrderButton name={p.name} sku={p.sku} price={p.price} />
            </div>

            <div className="mt-6 space-y-2 border-t border-line pt-4 text-[14px]">
              <p>
                Gọi điện để được tư vấn:{" "}
                <a href={`tel:${SITE.phone}`} className="text-[20px] text-brand hover:underline">
                  {SITE.phone}
                </a>
              </p>
              <Link href="/chinh-sach/huong-dan" className="inline-block text-gray-600 underline-offset-2 hover:text-brand hover:underline">
                Hướng dẫn mua hàng
              </Link>
            </div>

            <ul className="mt-5 grid gap-2 text-[13px] sm:grid-cols-3">
              {PROMISES.slice(0, 3).map((pr) => {
                const Icon = pr.key === "ship" ? Truck : pr.key === "warranty" ? ShieldCheck : RefreshCw;
                return (
                  <li key={pr.key}>
                    <Link href={pr.href} className="flex h-full items-center gap-2 bg-soft p-2.5 transition-colors hover:text-brand">
                      <Icon className="h-5 w-5 shrink-0 text-brand" /> {pr.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <ProductTabs
            tabs={[
              {
                id: "info",
                label: "Thông tin sản phẩm",
                content: (
                  <div className="max-w-3xl">
                    {p.specs.length > 0 && (
                      <table className="mb-5 w-full border-collapse text-[14px]">
                        <tbody>
                          {p.specs.map((s) => (
                            <tr key={s.label} className="border-b border-line">
                              <th scope="row" className="w-40 bg-soft px-3 py-2 text-left font-medium text-ink">{s.label}</th>
                              <td className="px-3 py-2">{s.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <div className="space-y-3 text-[15px] leading-relaxed">
                      {p.description.map((d, k) => (
                        <p key={k} className="whitespace-pre-line">
                          {d.replace(/\n{2,}/g, "\n")}
                        </p>
                      ))}
                      {!p.description.length && !p.specs.length && (
                        <p>Liên hệ hotline {SITE.phone} để được tư vấn chi tiết về sản phẩm.</p>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                id: "guide",
                label: "Hướng dẫn mua hàng",
                content: (
                  <ol className="max-w-3xl space-y-2 text-[15px]">
                    {BUY_STEPS.map((s, k) => (
                      <li key={k} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white">{k + 1}</span>
                        {s}
                      </li>
                    ))}
                    <li className="pt-2 text-[14px] text-gray-600">
                      Xem chi tiết:{" "}
                      <Link href="/chinh-sach/huong-dan" className="text-brand underline">hướng dẫn mua hàng</Link>,{" "}
                      <Link href="/chinh-sach/quy-dinh-thanh-toan" className="text-brand underline">thanh toán</Link>,{" "}
                      <Link href="/chinh-sach/chinh-sach-giao-hang-lap-dat" className="text-brand underline">giao hàng &amp; lắp đặt</Link>.
                    </li>
                  </ol>
                ),
              },
            ]}
          />
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <SectionHeading title="Sản phẩm liên quan" href={cat ? `/danh-muc/${cat.slug}` : undefined} />
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.slug} p={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
