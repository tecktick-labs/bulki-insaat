import type { Metadata } from "next";
import SiteContent from "@/components/SiteContent";
import { getProjectContent } from "@/lib/project-content.server";
import { getSiteSections } from "@/lib/site-sections.server";
import { JsonLd, residenceSchema } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [content, sections] = await Promise.all([getProjectContent(), getSiteSections()]);

  return (
    <>
      <SiteContent content={content} sections={sections} />
      <JsonLd schema={residenceSchema(content)} />
    </>
  );
}
