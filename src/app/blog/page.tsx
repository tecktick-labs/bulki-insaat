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
  const copy = await getPageCopy("blog");
  return pageMetadata({ title: copy.seoTitle, description: copy.seoDescription, path: "/blog" });
}

export default async function BlogPage() {
  const [content, copy, posts] = await Promise.all([getProjectContent(), getPageCopy("blog"), getPosts("blog")]);

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Blog" title={copy.title} lead={copy.lead}>
        <Breadcrumbs trail={[{ name: "Blog", path: "/blog" }]} />
      </PageHeader>

      {copy.blocks.length > 0 && (
        <Container className="pt-10">
          <BlockRenderer blocks={copy.blocks} />
        </Container>
      )}

      <PostList posts={posts} emptyMessage="Henüz yayımlanmış bir yazı yok. Kısa süre içinde burada olacağız." />


      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: copy.title,
            url: absoluteUrl("/blog"),
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
