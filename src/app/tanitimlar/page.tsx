import type { Metadata } from "next";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import PostList from "@/components/PostList";
import { PageHeader } from "@/components/Prose";
import { getPosts } from "@/lib/content.server";
import { postUrl } from "@/lib/content-types";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { getProjectContent } from "@/lib/project-content.server";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "Tanıtımlar",
  description: "Elys Prime tanıtım içerikleri ve dijital broşürleri. Proje detaylarını görsellerle inceleyin.",
  path: "/tanitimlar",
});

export default async function TanitimlarPage() {
  const [content, posts] = await Promise.all([getProjectContent(), getPosts("tanitim")]);

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Tanıtım & Broşür" title="Tanıtımlar" lead="Elys Prime'ın tanıtım içerikleri ve dijital broşürleri.">
        <Breadcrumbs trail={[{ name: "Tanıtımlar", path: "/tanitimlar" }]} />
      </PageHeader>

      <PostList posts={posts} emptyMessage="Henüz yayımlanmış bir tanıtım içeriği yok." />


      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Tanıtımlar", path: "/tanitimlar" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Tanıtımlar",
            url: absoluteUrl("/tanitimlar"),
            hasPart: posts.map((post) => ({
              "@type": "Article",
              headline: post.title,
              url: absoluteUrl(postUrl(post)),
              datePublished: post.publishedAt,
            })),
          },
        ]}
      />
    </PageShell>
  );
}
