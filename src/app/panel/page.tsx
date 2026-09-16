import type { Metadata } from "next";
import PanelClient from "@/components/PanelClient";

export const metadata: Metadata = {
  title: "Yönetim Paneli",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function PanelPage() {
  return <PanelClient />;
}
