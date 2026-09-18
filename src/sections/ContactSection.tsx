"use client";
import { ArrowUp, ArrowUpRight, Building2, Download, FileText, Mail, MapPin, MessageCircle, Newspaper, Phone } from "lucide-react";
import Link from "next/link";
import type { ContactPerson } from "@/lib/project-content";
import type { ProjectDocument } from "@/lib/documents";
import { campaignUrl, type Campaign } from "@/lib/campaigns";

function digits(phone: string) { return phone.replace(/[^\d]/g, ""); }

export default function ContactSection({ projectName, companyName, email, contacts, latitude, longitude, documents, campaigns }: { projectName: string; companyName: string; email: string; contacts: ContactPerson[]; latitude: number; longitude: number; documents: ProjectDocument[]; campaigns: Campaign[] }) {
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const message = encodeURIComponent(`Merhaba, ${projectName} hakkında bilgi almak istiyorum.`);

  // Son bölüm: içerik ekrandan uzun. Eskiden h-dvh + iç kaydırma vardı ve
  // dıştaki snap konteyneriyle çakışıp mobilde kaymaya yol açıyordu.
  // Artık bölüm içeriğiyle birlikte uzuyor, tek bir kaydırma var.
  return <section id="iletisim" className="min-h-dvh snap-start bg-[#171917] text-white">
    <div className="mx-auto flex min-h-dvh max-w-[1440px] flex-col px-5 pb-8 pt-24 sm:px-9 lg:px-14 lg:pb-10 lg:pt-28">
      <div className="grid shrink-0 gap-4 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div>
          <p className="eyebrow text-[#d8b792]">Satış &amp; Randevu</p>
          <h2 className="mt-3 text-4xl font-semibold leading-[.95] tracking-[-.04em] sm:text-5xl lg:text-6xl">Yeni yaşamınızla <em className="font-light">tanışın.</em></h2>
          <p className="mt-3 hidden max-w-xl text-sm leading-6 text-white/50 sm:block">Güncel fiyatlar, ödeme planı ve daire seçenekleri için doğrudan yetkililerimizle görüşün.</p>
        </div>
        <a href={`https://wa.me/${digits(contacts[0]?.whatsapp ?? "")}?text=${message}`} target="_blank" rel="noreferrer" className="group hidden items-center justify-between border border-[#d8b792]/60 p-5 transition-colors hover:bg-[#d8b792] hover:text-[#181a18] sm:flex">
          <span><MessageCircle className="mb-2" size={19}/><strong className="display-font block text-2xl font-semibold">WhatsApp&apos;tan yazın</strong></span>
          <ArrowUpRight/>
        </a>
      </div>

      {/* Satış ekibi */}
      <div className="mt-6 grid shrink-0 grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {contacts.map((contact, index) => (
          <article key={contact.phone} className="group min-w-0 rounded-xl border border-white/10 bg-[#202320] p-4 transition-colors hover:border-[#d8b792]/30 sm:rounded-2xl lg:p-5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="display-font hidden shrink-0 text-2xl font-semibold text-white/10 sm:block">0{index + 1}</span>
              <div className="min-w-0">
                <span className="block truncate text-[8px] font-bold uppercase tracking-[.12em] text-[#d8b792]">{contact.role}</span>
                <h3 className="mt-1 text-lg font-semibold leading-tight sm:text-xl">{contact.name}</h3>
                <p className="mt-1 text-[11px] text-white/40">{contact.phone}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-1.5">
              <a href={`tel:${digits(contact.phone)}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-[8px] font-bold uppercase tracking-[.08em] transition-colors hover:bg-white hover:text-black"><Phone size={11}/> Ara</a>
              <a href={`https://wa.me/${digits(contact.whatsapp)}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#d8b792] px-3 py-2 text-[8px] font-bold uppercase tracking-[.08em] text-[#181a18] transition-colors hover:bg-white"><MessageCircle size={11}/> Yaz</a>
            </div>
          </article>
        ))}
      </div>

      <footer className="mt-auto pt-8">
        <div className="grid gap-8 border-t border-white/15 pt-8 lg:grid-cols-[1.25fr_1fr_1.35fr]">
          <div>
            <strong className="display-font block text-xl font-semibold text-white sm:text-2xl">{companyName}</strong>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">Elys Prime resmî proje sunumu. Pendik&apos;te 4 blok, 192 daire.</p>
            <div className="mt-4 flex flex-col gap-2">
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-xs text-white/55 transition-colors hover:text-[#d8b792]"><Mail size={14}/> {email}</a>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-white/55 transition-colors hover:text-[#d8b792]"><MapPin size={14}/> Pendik / İstanbul</a>
            </div>
          </div>

          <nav aria-label="Alt menü">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/40">Keşfedin</p>
            <ul className="mt-4 grid gap-2.5">
              {campaigns.map((campaign) => (
                <li key={campaign.slug}><Link href={campaignUrl(campaign)} className="text-xs text-white/60 transition-colors hover:text-[#d8b792]">{campaign.label}</Link></li>
              ))}
              <li><Link href="/daire-planlari" className="text-xs text-white/60 transition-colors hover:text-[#d8b792]">Daire Planları</Link></li>
              <li><Link href="/tanitimlar" className="inline-flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-[#d8b792]"><FileText size={13}/> Tanıtımlar</Link></li>
              <li><Link href="/blog" className="inline-flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-[#d8b792]"><Newspaper size={13}/> Blog</Link></li>
            </ul>
          </nav>

          {/* Belgelerimiz — PDF'ler panelden yüklenene kadar "yakında" durumunda. */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/40">Belgelerimiz</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {documents.map((document) => {
                const inner = (
                  <>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-[#171917] text-[#d8b792] transition-colors group-hover:bg-[#d8b792] group-hover:text-[#181a18]">
                      {document.file ? <Download size={14}/> : <FileText size={14}/>}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold text-white/85">{document.title}</span>
                      <span className="mt-0.5 block truncate text-[9px] uppercase tracking-[.1em] text-white/35">{document.file ? "PDF indir" : "Yakında"}</span>
                    </span>
                  </>
                );
                const shell = "group flex items-center gap-3 rounded-xl border border-white/10 bg-[#202320] p-3 transition-colors";
                return (
                  <li key={document.slug}>
                    {document.file
                      ? <a href={document.file} target="_blank" rel="noreferrer" download className={`${shell} hover:border-[#d8b792]/40`}>{inner}</a>
                      : <span className={`${shell} cursor-default opacity-60`} aria-disabled="true" title="Bu belge yakında yayınlanacak">{inner}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[.14em] text-white/35">
          <span>© {new Date().getFullYear()} {companyName}</span>
          <div className="flex items-center gap-5">
            <Link href="/panel" className="inline-flex items-center gap-2 transition-colors hover:text-white"><Building2 size={13}/> Yönetim paneli</Link>
            <a href="#giris" className="inline-flex items-center gap-2 transition-colors hover:text-white">Başa dön <ArrowUp size={13}/></a>
          </div>
        </div>
      </footer>
    </div>
  </section>;
}
