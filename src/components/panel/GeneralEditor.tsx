"use client";
import { Check, RotateCcw, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { projectDefaults, type ProjectContent } from "@/lib/project-content";
import { saveProjectContent } from "@/lib/project-content.client";
import { inputClass, labelClass } from "./ui";

export default function GeneralEditor({
  content,
  setContent,
}: {
  content: ProjectContent;
  setContent: React.Dispatch<React.SetStateAction<ProjectContent>>;
}) {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataError, setDataError] = useState("");

  const totals = useMemo(
    () => content.blocks.reduce(
      (sum, block) => ({ total: sum.total + Number(block.total || 0), sold: sum.sold + Number(block.sold || 0) }),
      { total: 0, sold: 0 },
    ),
    [content.blocks],
  );

  const setGeneral = (key: keyof ProjectContent["general"], value: string | number) => setContent((current) => ({ ...current, general: { ...current.general, [key]: value } }));
  const setBlock = (index: number, key: keyof ProjectContent["blocks"][number], value: string | number) => setContent((current) => ({ ...current, blocks: current.blocks.map((block, blockIndex) => blockIndex === index ? { ...block, [key]: value } : block) }));
  const setContact = (index: number, key: keyof ProjectContent["contacts"][number], value: string) => setContent((current) => ({ ...current, contacts: current.contacts.map((contact, contactIndex) => contactIndex === index ? { ...contact, [key]: value } : contact) }));

  const persist = async (next: ProjectContent) => {
    setContent(next);
    setIsSaving(true);
    setDataError("");
    try {
      await saveProjectContent(next);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      setDataError(error instanceof Error && error.message.startsWith("Kaydedildi")
        ? error.message
        : "Değişiklikler kaydedilemedi. Yetkinizi ve Firestore Rules ayarını kontrol edin.");
    } finally {
      setIsSaving(false);
    }
  };

  const save = () => persist({ ...content, general: { ...content.general, totalUnits: totals.total, unitsSold: totals.sold } });

  const reset = async () => {
    if (!window.confirm("Paneldeki değişiklikler varsayılan değerlere döndürülsün mü?")) return;
    await persist(projectDefaults);
  };

  return <div>
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="eyebrow text-[#d8b792]">Proje Verileri</p><h2 className="mt-4 text-4xl font-medium tracking-[-.04em] sm:text-5xl">Proje bilgilerini güncelleyin.</h2></div><p className="max-w-sm text-xs leading-6 text-white/45">Değerler Firestore&apos;da saklanır. Kaydettiğinizde site önbelleği otomatik tazelenir ve değişiklik birkaç saniye içinde yayına girer.</p></div>

      {dataError && <p role="alert" className="mb-6 border border-red-300/25 bg-red-300/10 px-5 py-4 text-sm text-red-200">{dataError}</p>}

      <section className="border border-white/10 bg-[#202320] p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#d8b792]">01</p><h2 className="mt-1 text-3xl font-semibold">Genel Bilgiler</h2></div></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><label className={labelClass}>Konut adı<input className={inputClass} value={content.general.projectName} onChange={(e) => setGeneral("projectName", e.target.value)}/></label><label className={labelClass}>Şirket unvanı<input className={inputClass} value={content.general.companyName} onChange={(e) => setGeneral("companyName", e.target.value)}/></label><label className={labelClass}>Tamamlanma oranı<input type="number" min="0" max="100" className={inputClass} value={content.general.completionRate} onChange={(e) => setGeneral("completionRate", Number(e.target.value))}/></label><label className={labelClass}>İnşaat alanı (m²)<input type="number" min="0" className={inputClass} value={content.general.constructionArea} onChange={(e) => setGeneral("constructionArea", Number(e.target.value))}/></label></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><label className={labelClass}>Slogan<input className={inputClass} value={content.hero.title} onChange={(e) => setContent((current) => ({ ...current, hero: { ...current.hero, title: e.target.value } }))}/></label><label className={labelClass}>WhatsApp bağlantısı<input className={inputClass} value={content.general.whatsappLink} onChange={(e) => setGeneral("whatsappLink", e.target.value)}/></label><label className={labelClass}>E-posta<input type="email" className={inputClass} value={content.general.email} onChange={(e) => setGeneral("email", e.target.value)}/></label></div>
      </section>

      <section className="mt-6 border border-white/10 bg-[#202320] p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#d8b792]">02</p><h2 className="mt-1 text-3xl font-semibold">Blok ve Stok Durumu</h2></div><div className="flex gap-6"><div><strong className="display-font text-4xl">{totals.total}</strong><span className="ml-2 text-[9px] font-bold uppercase tracking-[.13em] text-white/40">Toplam</span></div><div><strong className="display-font text-4xl">{totals.sold}</strong><span className="ml-2 text-[9px] font-bold uppercase tracking-[.13em] text-white/40">Satılan</span></div></div></div>
        <div className="grid gap-4 lg:grid-cols-2">{content.blocks.map((block, index) => <article key={block.name} className="border border-white/10 bg-[#292c29] p-5"><div className="mb-5 flex items-center justify-between"><input aria-label="Blok adı" value={block.name} onChange={(e) => setBlock(index, "name", e.target.value)} className="display-font w-36 border-b border-white/15 bg-transparent text-2xl font-semibold outline-none focus:border-[#d8b792]"/><span className="text-xs font-bold text-[#d8b792]">{Math.max(0, block.total - block.sold)} daire kaldı</span></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-5">{([ ["total","Toplam"], ["sold","Satılan"], ["normalCorner","Normal Köşe"], ["normalMiddle","Normal Orta"], ["special","Çatı / Dubleks"] ] as const).map(([key,label]) => <label key={key} className={labelClass}>{label}<input type="number" min="0" className={inputClass} value={block[key]} onChange={(e) => setBlock(index, key, Number(e.target.value))}/></label>)}</div></article>)}</div>
      </section>

      <section className="mt-6 border border-white/10 bg-[#202320] p-5 sm:p-7"><div className="mb-6"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#d8b792]">03</p><h2 className="mt-1 text-3xl font-semibold">İletişim Bilgileri</h2></div><div className="grid gap-4 lg:grid-cols-2">{content.contacts.map((contact, index) => <article key={index} className="grid gap-4 border border-white/10 bg-[#292c29] p-5 sm:grid-cols-2"><label className={labelClass}>Ad soyad<input className={inputClass} value={contact.name} onChange={(e) => setContact(index, "name", e.target.value)}/></label><label className={labelClass}>Görev<input className={inputClass} value={contact.role} onChange={(e) => setContact(index, "role", e.target.value)}/></label><label className={labelClass}>Telefon<input className={inputClass} value={contact.phone} onChange={(e) => setContact(index, "phone", e.target.value)}/></label><label className={labelClass}>WhatsApp<input className={inputClass} value={contact.whatsapp} onChange={(e) => setContact(index, "whatsapp", e.target.value)}/></label></article>)}</div></section>

      <div className="mt-7 flex flex-wrap justify-between gap-3"><button type="button" disabled={isSaving} onClick={reset} className="inline-flex items-center gap-2 border border-white/15 px-5 py-4 text-[10px] font-bold uppercase tracking-[.13em] hover:bg-[#292c29] disabled:opacity-45"><RotateCcw size={14}/> Varsayılanlara dön</button><button type="button" disabled={isSaving} onClick={save} className="inline-flex items-center gap-2 bg-[#d8b792] px-7 py-4 text-[10px] font-bold uppercase tracking-[.13em] text-[#181a18] hover:bg-white disabled:opacity-45">{saved ? <Check size={14}/> : <Save size={14}/>} {isSaving ? "Kaydediliyor..." : saved ? "Kaydedildi" : "Değişiklikleri kaydet"}</button></div>

  </div>;
}
