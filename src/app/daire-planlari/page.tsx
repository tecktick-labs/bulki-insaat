import { permanentRedirect } from "next/navigation";
import { salesPath } from "@/lib/plan-routes";

export default function DairePlanlariPage() {
  permanentRedirect(salesPath);
}
