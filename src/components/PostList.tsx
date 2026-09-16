import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Prose";
import { postUrl, type Post } from "@/lib/content-types";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
}

export default function PostList({ posts, emptyMessage }: { posts: Post[]; emptyMessage: string }) {
  if (posts.length === 0) {
    return (
      <Container className="py-16">
        <p className="text-[15px] leading-8 text-white/45">{emptyMessage}</p>
      </Container>
    );
  }

  return (
    <Container className="py-10 lg:py-14">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id}>
            <Link
              href={postUrl(post)}
              className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#1f221f] transition-colors hover:border-[#d8b792]/45"
            >
              {post.coverImage && (
                <div className="relative aspect-[16/10] bg-black">
                  <Image
                    src={post.coverImage}
                    alt={post.coverAlt || post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {post.publishedAt && (
                  <time dateTime={post.publishedAt} className="text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">
                    {formatDate(post.publishedAt)}
                  </time>
                )}
                <h2 className="display-font mt-3 text-xl font-medium leading-snug tracking-[-.02em]">{post.title}</h2>
                {post.excerpt && <p className="mt-3 flex-1 text-sm leading-7 text-white/50">{post.excerpt}</p>}
                <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-white/45 transition-colors group-hover:text-[#d8b792]">
                  Devamını okuyun <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </Container>
  );
}
