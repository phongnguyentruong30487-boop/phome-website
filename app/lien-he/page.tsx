import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import ContactForm from "@/components/contact/ContactForm";
import { ZaloIcon } from "@/components/ui/BrandIcons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: `Liên hệ Nội thất P-Home – ${SITE.address}. Hotline ${SITE.phone}, email ${SITE.email}.`,
};

export default function ContactPage() {
  const rows = [
    { icon: MapPin, label: "Địa chỉ", value: SITE.address, href: SITE.maps, external: true },
    { icon: Phone, label: "Hotline", value: SITE.phone, href: `tel:${SITE.phone}` },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  ];

  return (
    <PageShell title="Liên hệ" crumbs={[{ label: "Liên hệ" }]}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="text-[16px] font-bold uppercase text-brand">{SITE.company}</h2>
          <ul className="mt-4 space-y-4">
            {rows.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[13px] text-gray-500">{label}</div>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="break-all text-[15px] font-medium text-ink hover:text-brand"
                  >
                    {value}
                  </a>
                </div>
              </li>
            ))}
            <li className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0068ff] text-white">
                <ZaloIcon className="h-7 w-7" />
              </span>
              <div>
                <div className="text-[13px] text-gray-500">Zalo</div>
                <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className="text-[15px] font-medium text-ink hover:text-brand">
                  Nhắn Zalo {SITE.phone}
                </a>
              </div>
            </li>
          </ul>
        </div>

        <div className="border border-line bg-soft p-5 md:p-6">
          <h2 className="text-[16px] font-bold uppercase text-ink">Gửi yêu cầu tư vấn &amp; báo giá</h2>
          <p className="mb-4 mt-1 text-[14px] text-gray-600">Để lại thông tin, P-Home sẽ liên hệ tư vấn miễn phí.</p>
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
