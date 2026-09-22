import type { Metadata } from "next";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import PostList from "@/components/PostList";
import BlockRenderer from "@/components/BlockRenderer";
import { Container, PageHeader } from "@/components/Prose";
import { getPageCopy, getPosts } from "@/lib/content.server";
import { postUrl } from "@/lib/content-types";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { getProjectContent } from "@/lib/project-content.server";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy("tanitimlar");
  return pageMetadata({ title: copy.seoTitle, description: copy.seoDescription, path: "/tanitimlar" });
}

export default async function TanitimlarPage() {
  const [content, copy, posts] = await Promise.all([getProjectContent(), getPageCopy("tanitimlar"), getPosts("tanitim")]);

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Tanıtım & Broşür" title={copy.title} lead={copy.lead}>
        <Breadcrumbs trail={[{ name: "Tanıtımlar", path: "/tanitimlar" }]} />
      </PageHeader>

      {copy.blocks.length > 0 && (
        <Container className="pt-10">
          <BlockRenderer blocks={copy.blocks} />
        </Container>
      )}

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
            name: copy.title,
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
