"use client";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { Check, ChevronLeft, LogOut, RotateCcw, Save } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { projectDefaults, type ProjectContent } from "@/lib/project-content";
import { fetchProjectContent, saveProjectContent } from "@/lib/project-content.client";

const inputClass = "mt-2 w-full border border-white/10 bg-[#181a18] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d8b792]";
const labelClass = "text-[10px] font-bold uppercase tracking-[.14em] text-white/45";

export default function PanelClient() {
  const [content, setContent] = useState<ProjectContent>(projectDefaults);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessError, setAccessError] = useState("");
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dataError, setDataError] = useState("");

  const loadContent = useCallback(async () => {
    try {
      setContent(await fetchProjectContent());
      setDataError("");
    } catch {
      setDataError("Veriler Firestore'dan yüklenemedi. Bağlantıyı ve Firestore Rules ayarını kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Firebase Auth harici bir sistem; oturum durumu değiştiğinde içeriği de burada çekiyoruz.
  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser);
    setAuthReady(true);
    if (nextUser) void loadContent();
  }), [loadContent]);

  const totals = useMemo(() => content.blocks.reduce((sum, block) => ({ total: sum.total + Number(block.total || 0), sold: sum.sold + Number(block.sold || 0) }), { total: 0, sold: 0 }), [content.blocks]);
  const setGeneral = (key: keyof ProjectContent["general"], value: string | number) => setContent((current) => ({ ...current, general: { ...current.general, [key]: value } }));
  const setBlock = (index: number, key: keyof ProjectContent["blocks"][number], value: string | number) => setContent((current) => ({ ...current, blocks: current.blocks.map((block, blockIndex) => blockIndex === index ? { ...block, [key]: value } : block) }));
  const setContact = (index: number, key: keyof ProjectContent["contacts"][number], value: string) => setContent((current) => ({ ...current, contacts: current.contacts.map((contact, contactIndex) => contactIndex === index ? { ...contact, [key]: value } : contact) }));

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccessError("");
    setIsCheckingAccess(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
    } catch {
      setAccessError("E-posta veya şifre hatalı.");
    } finally {
      setIsCheckingAccess(false);
    }
  };

  const logout = () => void signOut(auth);

  const save = async () => {
    const normalized = { ...content, general: { ...content.general, totalUnits: totals.total, unitsSold: totals.sold } };
    setContent(normalized);
    setIsSaving(true);
    setDataError("");
    try {
      await saveProjectContent(normalized);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      setDataError(error instanceof Error && error.message.startsWith("İçerik kaydedildi")
        ? error.message
        : "Değişiklikler kaydedilemedi. Yetkinizi ve Firestore Rules ayarını kontrol edin.");
    } finally {
      setIsSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm("Paneldeki değişiklikler varsayılan değerlere döndürülsün mü?")) return;
    setContent(projectDefaults);
    setIsSaving(true);
    try {
      await saveProjectContent(projectDefaults);
    } catch {
      setDataError("Varsayılan değerler Firestore'a kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!authReady) return <main className="grid min-h-dvh place-items-center bg-[#181a18] text-sm text-white/55">Oturum kontrol ediliyor...</main>;

  if (!user) return <main className="grid min-h-dvh place-items-center bg-[#181a18] px-5 text-[#f6f1eb]">
    <section className="w-full max-w-md border border-white/10 bg-[#202320] p-7 sm:p-10">
      <p className="eyebrow text-[#d8b792]">Elys Prime</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-.03em]">Yönetim paneli</h1>
      <p className="mt-3 text-sm leading-6 text-white/45">Devam etmek için yönetici hesabınızla giriş yapın.</p>
      <form onSubmit={login} className="mt-8">
        <label className={labelClass}>E-posta<input autoFocus autoComplete="username" type="email" className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className={`${labelClass} mt-4 block`}>Şifre<input autoComplete="current-password" type="password" className={inputClass} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {accessError && <p role="alert" className="mt-3 text-xs leading-5 text-red-300">{accessError}</p>}
        <button disabled={isCheckingAccess || !email.trim() || !password} className="mt-5 w-full bg-[#d8b792] px-5 py-4 text-[10px] font-bold uppercase tracking-[.13em] text-[#181a18] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45">{isCheckingAccess ? "Kontrol ediliyor..." : "Panele gir"}</button>
      </form>
      <Link href="/" className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-white/45 hover:text-white"><ChevronLeft size={14}/> Siteye dön</Link>
    </section>
  </main>;

  if (isLoading) return <main className="grid min-h-dvh place-items-center bg-[#181a18] text-sm text-white/55">Panel verileri yükleniyor...</main>;

  return <main className="min-h-dvh bg-[#181a18] text-[#f6f1eb]">
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#181a18]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div><p className="display-font text-2xl font-semibold">Elys Prime</p><p className="text-[8px] font-bold uppercase tracking-[.22em] text-white/40">Yönetim Paneli</p></div>
        <div className="flex items-center gap-2"><Link href="/" className="inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[.12em] hover:bg-[#292c29]"><ChevronLeft size={14}/> Siteye dön</Link><button onClick={logout} aria-label="Çıkış yap" className="border border-white/15 p-3 hover:bg-[#292c29]"><LogOut size={14}/></button><button disabled={isSaving} onClick={save} className="inline-flex items-center gap-2 bg-[#d8b792] px-4 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#181a18] hover:bg-white disabled:opacity-45">{saved ? <Check size={14}/> : <Save size={14}/>} {isSaving ? "Kaydediliyor" : saved ? "Kaydedildi" : "Kaydet"}</button></div>
      </div>
    </header>

    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="eyebrow text-[#d8b792]">İçerik Yönetimi</p><h1 className="mt-4 text-5xl font-medium tracking-[-.04em] sm:text-6xl">Proje bilgilerini güncelleyin.</h1></div><p className="max-w-sm text-xs leading-6 text-white/45">Değerler Firestore&apos;da saklanır. Kaydettiğinizde site önbelleği otomatik tazelenir ve değişiklik birkaç saniye içinde yayına girer.</p></div>

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

      <div className="mt-7 flex flex-wrap justify-between gap-3"><button disabled={isSaving} onClick={reset} className="inline-flex items-center gap-2 border border-white/15 px-5 py-4 text-[10px] font-bold uppercase tracking-[.13em] hover:bg-[#292c29] disabled:opacity-45"><RotateCcw size={14}/> Varsayılanlara dön</button><button disabled={isSaving} onClick={save} className="inline-flex items-center gap-2 bg-[#d8b792] px-7 py-4 text-[10px] font-bold uppercase tracking-[.13em] text-[#181a18] hover:bg-white disabled:opacity-45"><Save size={14}/> {isSaving ? "Kaydediliyor..." : "Değişiklikleri kaydet"}</button></div>
    </div>
  </main>;
}
