import Link from "next/link";

export default function SideBox({ title, links }: { title: string; links: { href: string; label: string; active?: boolean }[] }) {
  return (
    <div>
      <h2 className="text-[15px] font-medium uppercase text-ink">
        <span className="inline-block border-b-2 border-brand pb-1.5">{title}</span>
      </h2>
      <ul className="mt-2 border border-line">
        {links.map((l) => (
          <li key={l.href} className="border-b border-line last:border-0">
            <Link
              href={l.href}
              aria-current={l.active ? "page" : undefined}
              className={`block px-3 py-2.5 text-[14px] leading-snug transition-colors hover:text-brand ${l.active ? "font-bold text-brand" : "text-ink"}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
