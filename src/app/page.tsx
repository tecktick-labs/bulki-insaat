import type { Metadata } from "next";
import SiteContent from "@/components/SiteContent";
import { getProjectContent } from "@/lib/project-content.server";
import { JsonLd, residenceSchema } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const content = await getProjectContent();

  return (
    <>
      <SiteContent content={content} />
      <JsonLd schema={residenceSchema(content)} />
    </>
  );
}
