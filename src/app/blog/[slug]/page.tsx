import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import PostDetail from "@/components/PostDetail";
import { getPost, getPosts } from "@/lib/content.server";
import { postUrl } from "@/lib/content-types";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl, companyName } from "@/lib/site";
import { getProjectContent } from "@/lib/project-content.server";

export const revalidate = 600;

export async function generateStaticParams() {
  const posts = await getPosts("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost("blog", slug);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return pageMetadata({
    title,
    description,
    path: postUrl(post),
    type: "article",
    image: post.coverImage || undefined,
    imageAlt: post.coverAlt || post.title,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, content] = await Promise.all([getPost("blog", slug), getProjectContent()]);
  if (!post) notFound();

  return (
    <PageShell content={content}>
      <PostDetail
        post={post}
        listLabel="Blog"
        whatsappLink={content.general.whatsappLink}
        email={content.general.email}
      />

      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: postUrl(post) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.seoDescription || post.excerpt,
            url: absoluteUrl(postUrl(post)),
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            image: post.coverImage || undefined,
            author: { "@type": "Organization", name: companyName },
            publisher: { "@type": "Organization", name: companyName },
          },
        ]}
      />
    </PageShell>
  );
}
