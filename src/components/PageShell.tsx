import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectContent } from "@/lib/project-content";

export const pageNav = [
  { href: "/proje", label: "Proje" },
  { href: "/proje-durumu", label: "Proje Durumu" },
  { href: "/daire-planlari", label: "Daire Planları" },
  { href: "/konum", label: "Konum" },
  { href: "/tanitimlar", label: "Tanıtımlar" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

function digits(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-white/40">
      <Link href="/" className="transition-colors hover:text-[#d8b792]">Ana Sayfa</Link>
      {trail.map((item, index) => (
        <span key={item.path} className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          {index === trail.length - 1
            ? <span className="text-white/70">{item.name}</span>
            : <Link href={item.path} className="transition-colors hover:text-[#d8b792]">{item.name}</Link>}
        </span>
      ))}
    </nav>
  );
}

export default function PageShell({ content, children }: { content: ProjectContent; children: ReactNode }) {
  const { general, contacts } = content;

  return (
    <div className="min-h-dvh bg-[#181a18] text-[#f6f1eb]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#181a18]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-9 lg:px-14">
          <Link href="/" className="flex items-center gap-3" aria-label="Elys Prime ana sayfa">
            <span className="grid size-9 place-items-center border border-white/50 text-sm font-bold tracking-[-.08em]">EP</span>
            <span>
              <span className="display-font block text-xl font-semibold leading-none tracking-wide">ELYS PRIME</span>
              <span className="mt-1 block text-[8px] font-bold tracking-[.25em] opacity-60">BULKİ YAPI</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {pageNav.map((item) => (
              <Link key={item.href} href={item.href} className="py-2 text-[11px] font-bold uppercase tracking-[.17em] opacity-75 transition-opacity hover:opacity-100">
                {item.label}
              </Link>
            ))}
          </nav>
          <a href={general.whatsappLink} target="_blank" rel="noreferrer" className="shrink-0 border border-white/45 px-4 py-3 text-[10px] font-bold uppercase tracking-[.16em] transition-colors hover:bg-[#d8b792] hover:text-[#181a18]">
            Randevu Al
          </a>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-[#141614]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-9 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-14">
          <div>
            <strong className="display-font block text-2xl font-semibold">{general.companyName}</strong>
            <p className="mt-3 max-w-sm text-sm leading-7 text-white/50">
              Elys Prime, Pendik&apos;te {general.totalUnits} daireden oluşan, {general.constructionArea.toLocaleString("tr-TR")} m² inşaat alanına sahip yeni nesil bir yaşam projesidir.
            </p>
            <a href={general.whatsappLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#d8b792] hover:text-white">
              <MessageCircle size={14} /> WhatsApp&apos;tan yazın <ArrowUpRight size={13} />
            </a>
          </div>

          <nav aria-label="Alt menü">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/40">Sayfalar</p>
            <ul className="mt-4 space-y-3">
              {pageNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/65 transition-colors hover:text-[#d8b792]">{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/40">İletişim</p>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              {contacts.map((contact) => (
                <li key={contact.phone}>
                  <a href={`tel:${digits(contact.phone)}`} className="inline-flex items-center gap-2 transition-colors hover:text-[#d8b792]">
                    <Phone size={13} /> {contact.phone}
                  </a>
                  <span className="mt-0.5 block text-[10px] uppercase tracking-[.12em] text-white/35">{contact.name} · {contact.role}</span>
                </li>
              ))}
              <li>
                <a href={`mailto:${general.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-[#d8b792]">
                  <Mail size={13} /> {general.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-white/50">
                <MapPin size={13} /> Pendik / İstanbul
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-[10px] font-bold uppercase tracking-[.14em] text-white/35 sm:px-9 lg:px-14">
            <span>© {new Date().getFullYear()} {general.companyName}</span>
            <Link href="/panel" className="transition-colors hover:text-white">Yönetim Paneli</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
