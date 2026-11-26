import Breadcrumb, { type Crumb } from "./Breadcrumb";

/** Khung chung cho trang nội dung: breadcrumb + tiêu đề + nội dung */
export default function PageShell({
  title,
  crumbs,
  children,
  aside,
}: {
  title: string;
  crumbs: Crumb[];
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb items={crumbs} />
      <div className="container-site pb-16 pt-6">
        <div className={aside ? "grid gap-8 lg:grid-cols-[1fr_280px]" : undefined}>
          <div className="min-w-0">
            <h1 className="text-[22px] font-medium leading-snug text-ink">{title}</h1>
            <div className="mt-4">{children}</div>
          </div>
          {aside && <aside className="space-y-6">{aside}</aside>}
        </div>
      </div>
    </>
  );
}
