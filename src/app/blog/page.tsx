import type { Metadata } from "next";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import PostList from "@/components/PostList";
import { PageHeader } from "@/components/Prose";
import { getPosts } from "@/lib/content.server";
import { postUrl } from "@/lib/content-types";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { getProjectContent } from "@/lib/project-content.server";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Elys Prime blogu: konut alım süreci, daire tipi seçimi, Pendik'te yaşam ve projeden güncel notlar.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: "Blog | Elys Prime", description: "Elys Prime blogu: konut alım süreci, daire tipi seçimi, Pendik'te yaşam ve projeden güncel notlar." },
};

export default async function BlogPage() {
  const [content, posts] = await Promise.all([getProjectContent(), getPosts("blog")]);

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Blog" title="Blog" lead="Konut alım süreci, Pendik'teki yaşam ve projeden güncel notlar.">
        <Breadcrumbs trail={[{ name: "Blog", path: "/blog" }]} />
      </PageHeader>

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
            name: "Blog",
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
