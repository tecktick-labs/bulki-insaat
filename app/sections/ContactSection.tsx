import { ArrowUp, ArrowUpRight, Building2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

function digits(phone: string) { return phone.replace(/[^\d]/g, ""); }
export type ContactPerson = { name: string; role: string; phone: string; whatsapp: string };

export default function ContactSection({ projectName, companyName, email, contacts }: { projectName: string; companyName: string; email: string; contacts: ContactPerson[] }) {
  const mapUrl = "https://www.google.com/maps?q=40.948906,29.302832";
  const message = encodeURIComponent(`Merhaba, ${projectName} hakkında bilgi almak istiyorum.`);

  return <section id="iletisim" className="h-dvh snap-start snap-always overflow-hidden bg-[#171917] text-white">
    <div className="mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-5 pt-24 sm:px-9 sm:pb-8 lg:px-14 lg:pb-10 lg:pt-28">
      <div className="grid shrink-0 gap-4 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div><p className="eyebrow text-[#d8b792]">Satış & Randevu</p><h2 className="mt-3 text-4xl font-medium leading-[.86] tracking-[-.05em] sm:text-6xl lg:text-7xl">Yeni yaşamınızla <em>tanışın.</em></h2><p className="mt-3 hidden max-w-xl text-xs leading-6 text-white/50 sm:block">Güncel fiyatlar, ödeme planı ve daire seçenekleri için doğrudan yetkililerimizle görüşün.</p></div>
        <a href={`https://wa.me/${digits(contacts[0]?.whatsapp ?? "")}?text=${message}`} target="_blank" rel="noreferrer" className="group hidden items-center justify-between border border-[#d8b792]/60 p-5 transition-colors hover:bg-[#d8b792] hover:text-[#181a18] sm:flex"><span><MessageCircle className="mb-2" size={19}/><strong className="display-font block text-2xl font-medium">WhatsApp&apos;tan yazın</strong></span><ArrowUpRight/></a>
      </div>

      <div className="mt-auto grid shrink-0 grid-cols-2 gap-2 pt-5 sm:gap-3">{contacts.map((contact, index) => <article key={contact.phone} className="group min-w-0 rounded-xl border border-white/10 bg-[#202320] p-3 transition-colors hover:border-[#d8b792]/30 sm:rounded-2xl sm:p-4 lg:p-5"><div className="flex min-w-0 items-start gap-3"><span className="display-font hidden shrink-0 text-2xl font-medium text-white/10 sm:block">0{index + 1}</span><div className="min-w-0"><span className="block truncate text-[6px] font-bold uppercase tracking-[.12em] text-[#d8b792] sm:text-[8px]">{contact.role}</span><h3 className="mt-1 text-base font-medium leading-tight sm:text-xl lg:text-2xl">{contact.name}</h3><p className="mt-1 text-[8px] text-white/40 sm:text-[11px]">{contact.phone}</p></div></div><div className="mt-3 flex justify-end gap-1.5"><a href={`tel:${contact.phone}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-2 text-[7px] font-bold uppercase tracking-[.08em] transition-colors hover:bg-white hover:text-black sm:px-3"><Phone size={11}/> <span className="hidden sm:inline">Ara</span></a><a href={`https://wa.me/${digits(contact.whatsapp)}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#d8b792] px-2.5 py-2 text-[7px] font-bold uppercase tracking-[.08em] text-[#181a18] transition-colors hover:bg-white sm:px-3"><MessageCircle size={11}/> <span className="hidden sm:inline">Yaz</span></a></div></article>)}</div>

      <footer className="mt-4 grid shrink-0 grid-cols-2 gap-3 border-t border-white/15 pt-4 text-white/50 lg:grid-cols-[1.3fr_1fr_auto_auto_auto] lg:items-center">
        <div className="col-span-2 lg:col-span-1"><strong className="display-font block text-lg font-semibold text-white sm:text-xl">{companyName}</strong><span className="text-[8px] font-bold uppercase tracking-[.16em]">Elys Prime resmi proje sunumu</span></div>
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.12em] transition-colors hover:text-white"><Mail size={13}/> {email}</a>
        <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.12em] transition-colors hover:text-white"><MapPin size={13}/> Google konum</a>
        <a href="/panel" className="inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.12em] transition-colors hover:text-white"><Building2 size={13}/> Yönetim paneli</a>
        <a href="#giris" className="col-span-2 inline-flex items-center justify-end gap-2 text-[8px] font-bold uppercase tracking-[.12em] transition-colors hover:text-white lg:col-span-1">Başa dön <ArrowUp size={13}/></a>
      </footer>
    </div>
  </section>;
}
