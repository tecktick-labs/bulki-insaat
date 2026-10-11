import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SalesPage from "@/components/SalesPage";
import { salesCategories, salesPath } from "@/lib/plan-routes";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return salesCategories.map((item) => ({ category: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const item = salesCategories.find((item) => item.slug === category);
  if (!item) notFound();
  return pageMetadata({ title: item.title, description: item.description, path: `${salesPath}/${item.slug}` });
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!salesCategories.some((item) => item.slug === category)) notFound();
  return <SalesPage categorySlug={category} />;
}
