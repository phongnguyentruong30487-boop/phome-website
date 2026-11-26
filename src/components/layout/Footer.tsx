import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { mapSrc } from "@/lib/data";
import { FOOTER_GUIDE, FOOTER_POLICY, SITE } from "@/lib/site";
import { FacebookIcon, ZaloIcon } from "@/components/ui/BrandIcons";

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold uppercase tracking-[0.08em]">{title}</h3>
      <div className="mt-3 h-[3px] w-[60px] bg-white/40 md:hidden" />
      <div className="mt-5 text-[14px] leading-relaxed">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer>
      {mapSrc && (
        <iframe
          src={mapSrc}
          title="Bản đồ đường đến P-Home"
          className="block h-[270px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}

      <div className="bg-brand text-white">
        <div className="container-site grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <Col title="Hướng dẫn">
            <ul className="space-y-2">
              {FOOTER_GUIDE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col title="Chính sách">
            <ul className="space-y-2">
              {FOOTER_POLICY.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col title="Liên hệ với chúng tôi">
            <dl className="space-y-1">
              <dt className="font-bold">Địa chỉ</dt>
              <dd>{SITE.address}</dd>
              <dt className="pt-1 font-bold">Hotline</dt>
              <dd>
                <a href={`tel:${SITE.phone}`} className="hover:underline">
                  {SITE.phone}
                </a>
              </dd>
              <dt className="pt-1 font-bold">Email</dt>
              <dd>
                <a href={`mailto:${SITE.email}`} className="break-all hover:underline">
                  {SITE.email}
                </a>
              </dd>
            </dl>
          </Col>

          <Col title="Kết nối với P-Home">
            <p>Theo dõi P-Home để cập nhật mẫu mới và ưu đãi, hoặc nhắn Zalo để được tư vấn &amp; báo giá miễn phí.</p>
            <div className="mt-4 flex gap-3">
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook P-Home" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1877f2] transition-transform hover:scale-110">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" aria-label="Zalo P-Home" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0068ff] transition-transform hover:scale-110">
                <ZaloIcon className="h-7 w-7" />
              </a>
              <a href={`tel:${SITE.phone}`} aria-label="Gọi P-Home" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-hot transition-transform hover:scale-110">
                <Phone className="h-5 w-5" />
              </a>
              <a href={`mailto:${SITE.email}`} aria-label="Email P-Home" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand transition-transform hover:scale-110">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <a href={SITE.maps} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-start gap-2 text-white/90 hover:underline">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Xem đường đi trên Google Maps
            </a>
          </Col>
        </div>

        <div className="border-t border-white/15">
          <p className="container-site py-4 text-center text-[13px]">
            © Bản quyền thuộc về {SITE.company}
          </p>
        </div>
      </div>
    </footer>
  );
}
