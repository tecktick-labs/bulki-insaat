import type { Metadata } from "next";
import SalesPage, { salesTitle, salesDescription } from "@/components/SalesPage";
import { salesPath } from "@/lib/plan-routes";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const metadata: Metadata = pageMetadata({ title: salesTitle, description: salesDescription, path: salesPath });

export default function Page() {
  return <SalesPage />;
}
