import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlockRenderer from "@/components/BlockRenderer";
import { Breadcrumbs } from "@/components/PageShell";
import { CallToAction, Container, PageHeader } from "@/components/Prose";
import { postBasePath, postTypeLabels, postUrl, type Post } from "@/lib/content-types";

export default function PostDetail({
  post,
  listLabel,
  whatsappLink,
  email,
}: {
  post: Post;
  listLabel: string;
  whatsappLink: string;
  email: string;
}) {
  const basePath = postBasePath[post.type];

  return (
    <>
      <PageHeader eyebrow={postTypeLabels[post.type]} title={post.title} lead={post.excerpt}>
        <Breadcrumbs
          trail={[
            { name: listLabel, path: basePath },
            { name: post.title, path: postUrl(post) },
          ]}
        />
      </PageHeader>

      <Container className="py-10 lg:py-14">
        <div className="max-w-3xl">
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">
              {new Date(post.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          )}

          {post.coverImage && (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden bg-black">
              <Image src={post.coverImage} alt={post.coverAlt || post.title} fill priority sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
            </div>
          )}

          <div className="mt-10">
            <BlockRenderer blocks={post.blocks} />
          </div>

          {post.faq.length > 0 && (
            <section className="mt-14 border-t border-white/10 pt-10">
              <h2 className="display-font text-2xl font-medium tracking-[-.03em] sm:text-3xl">Sık sorulan sorular</h2>
              <dl className="mt-8 space-y-6">
                {post.faq.map((item) => (
                  <div key={item.question} className="border-b border-white/[.07] pb-6 last:border-0">
                    <dt className="text-[15px] font-semibold leading-7 text-[#f6f1eb]">{item.question}</dt>
                    <dd className="mt-3 text-[15px] leading-8 text-white/60">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <Link href={basePath} className="mt-12 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-white/45 transition-colors hover:text-[#d8b792]">
            <ArrowLeft size={14} /> {listLabel} sayfasına dön
          </Link>
        </div>
      </Container>

      <CallToAction whatsappLink={whatsappLink} email={email} />
    </>
  );
}
