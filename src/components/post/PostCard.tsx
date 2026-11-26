import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { formatDate, postCover, type Post } from "@/lib/data";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/tin-tuc/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-soft">
        <Image
          src={postCover(post)}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <h3 className="mt-3 line-clamp-2 text-[14px] font-medium uppercase leading-snug text-ink">
        <Link href={`/tin-tuc/${post.slug}`} className="transition-colors hover:text-brand">
          {post.title}
        </Link>
      </h3>
      {post.date && (
        <div className="mt-1 flex items-center gap-1 text-[12px] text-gray-500">
          <Calendar className="h-3.5 w-3.5" /> {formatDate(post.date)}
        </div>
      )}
      <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-gray-600">{post.excerpt}</p>
    </article>
  );
}
