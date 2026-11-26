import Link from "next/link";

/** Tiêu đề khối giữa trang kiểu web cũ: chữ in hoa + nút xanh bên dưới */
export default function SectionHeading({
  title,
  pill,
  href,
}: {
  title: string;
  pill?: string;
  href?: string;
}) {
  return (
    <div className="mb-6 text-center">
      <h2 className="section-title">
        {href ? (
          <Link href={href} className="transition-colors hover:text-brand">
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      {pill && (
        <div className="mt-3">
          {href ? (
            <Link href={href} className="inline-block rounded bg-brand px-3 py-1.5 text-[13px] font-bold uppercase text-white transition-colors hover:bg-brand-dark">
              {pill}
            </Link>
          ) : (
            <span className="inline-block rounded bg-brand px-3 py-1.5 text-[13px] font-bold uppercase text-white">{pill}</span>
          )}
        </div>
      )}
    </div>
  );
}
