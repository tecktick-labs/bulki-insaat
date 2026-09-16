import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import BlockRenderer from "@/components/BlockRenderer";
import { Container, PageHeader } from "@/components/Prose";
import { getPageCopy } from "@/lib/content.server";
import { getProjectContent } from "@/lib/project-content.server";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl, companyName } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy("iletisim");
  return pageMetadata({ title: copy.seoTitle, description: copy.seoDescription, path: "/iletisim" });
}

function digits(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export default async function IletisimPage() {
  const [content, copy] = await Promise.all([getProjectContent(), getPageCopy("iletisim")]);
  const { general, contacts, location } = content;
  const message = encodeURIComponent(`Merhaba, ${general.projectName} hakkında bilgi almak istiyorum.`);

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Satış & Randevu" title={copy.title} lead={copy.lead}>
        <Breadcrumbs trail={[{ name: "İletişim", path: "/iletisim" }]} />
      </PageHeader>

      <Container className="py-10 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-2">
          {contacts.map((contact) => (
            <article key={contact.phone} className="border border-white/10 bg-[#1f221f] p-7 lg:p-9">
              <span className="text-[9px] font-bold uppercase tracking-[.16em] text-[#d8b792]">{contact.role}</span>
              <h2 className="display-font mt-3 text-3xl font-medium tracking-[-.03em]">{contact.name}</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`tel:${digits(contact.phone)}`} className="inline-flex items-center gap-2 border border-white/20 px-5 py-4 text-[10px] font-bold uppercase tracking-[.13em] transition-colors hover:bg-white hover:text-[#181a18]">
                  <Phone size={14} /> {contact.phone}
                </a>
                <a href={`https://wa.me/${digits(contact.whatsapp)}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#d8b792] px-5 py-4 text-[10px] font-bold uppercase tracking-[.13em] text-[#181a18] transition-colors hover:bg-white">
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-5 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/40">E-posta</p>
            <a href={`mailto:${general.email}`} className="mt-3 inline-flex items-center gap-2 text-lg text-white/75 transition-colors hover:text-[#d8b792]">
              <Mail size={16} /> {general.email}
            </a>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/40">Konum</p>
            <a href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-lg text-white/75 transition-colors hover:text-[#d8b792]">
              <MapPin size={16} /> Pendik / İstanbul
            </a>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/40">Firma</p>
            <p className="mt-3 text-lg text-white/75">{general.companyName}</p>
          </div>
        </div>

        <div className="mt-10 max-w-2xl">
          <BlockRenderer blocks={copy.blocks} />
        </div>
      </Container>

      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "İletişim", path: "/iletisim" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: absoluteUrl("/iletisim"),
            mainEntity: {
              "@type": "Organization",
              name: companyName,
              email: general.email,
              contactPoint: contacts.map((contact) => ({
                "@type": "ContactPoint",
                name: contact.name,
                telephone: contact.phone,
                contactType: "sales",
                areaServed: "TR",
                availableLanguage: "Turkish",
              })),
            },
          },
        ]}
      />
    </PageShell>
  );
}
