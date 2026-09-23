"use client";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { ChevronLeft, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import CampaignsEditor from "./panel/CampaignsEditor";
import DocumentsEditor from "./panel/DocumentsEditor";
import GalleryEditor from "./panel/GalleryEditor";
import GeneralEditor from "./panel/GeneralEditor";
import HeroVideosEditor from "./panel/HeroVideosEditor";
import PagesEditor from "./panel/PagesEditor";
import PlanRoomsEditor from "./panel/PlanRoomsEditor";
import PostsEditor from "./panel/PostsEditor";
import { buttonClass, inputClass, labelClass, primaryButtonClass } from "./panel/ui";
import { auth } from "@/lib/firebase";
import { fetchAllPosts } from "@/lib/content.client";
import { fetchProjectContent } from "@/lib/project-content.client";
import { fetchSection } from "@/lib/sections.client";
import { pageSlugs } from "@/lib/content-types";
import { projectDefaults, type ProjectContent } from "@/lib/project-content";

type PanelSection = {
  id: string;
  label: string;
  hint: string;
  group: "İçerik" | "Yayın";
};

const sections: PanelSection[] = [
  { id: "genel", label: "Proje Verileri", hint: "Daire sayıları, bloklar, iletişim", group: "İçerik" },
  { id: "hero-videolari", label: "Hero Videoları", hint: "Giriş bölümünün mobil ve web videoları", group: "İçerik" },
  { id: "kampanyalar", label: "Kampanyalar", hint: "Broşür şeridi ve kampanya sayfaları", group: "İçerik" },
  { id: "galeri", label: "Galeri", hint: "Ana sayfa görselleri ve başlıkları", group: "İçerik" },
  { id: "belgeler", label: "Belgeler", hint: "Ruhsat, iskân, imar, tapu", group: "İçerik" },
  { id: "daire-tipleri", label: "Daire Tipleri", hint: "Plan görselleri, blok ve kat tipi", group: "İçerik" },
  { id: "sayfalar", label: "Sayfa Metinleri", hint: "Alt sayfaların metni ve SEO'su", group: "Yayın" },
  { id: "icerikler", label: "Blog & Tanıtım", hint: "Yazılar ve tanıtım sayfaları", group: "Yayın" },
];

/** Sidebar'daki rozetler: neyin eksik olduğunu bölümü açmadan göstermek için. */
type Badges = Partial<Record<string, string>>;

export default function PanelClient() {
  const [content, setContent] = useState<ProjectContent>(projectDefaults);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessError, setAccessError] = useState("");
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [active, setActive] = useState("genel");
  const [menuOpen, setMenuOpen] = useState(false);
  const [badges, setBadges] = useState<Badges>({});

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

  const loadBadges = useCallback(async () => {
    try {
      const [campaigns, gallery, documents, posts, heroVideos] = await Promise.all([
        fetchSection("campaigns"),
        fetchSection("gallery"),
        fetchSection("documents"),
        fetchAllPosts(),
        fetchSection("hero-videos"),
      ]);

      const missingPdf = documents.filter((document) => !document.file).length;
      const published = posts.filter((post) => post.published).length;

      const mobileVideos = heroVideos.filter((video) => video.variant === "mobile").length;

      setBadges({
        "hero-videolari": `${mobileVideos} mobil · ${heroVideos.length - mobileVideos} web`,
        kampanyalar: String(campaigns.length),
        galeri: String(gallery.length),
        belgeler: missingPdf > 0 ? `${documents.length} · ${missingPdf} eksik` : String(documents.length),
        "daire-tipleri": "16",
        sayfalar: String(pageSlugs.length),
        icerikler: published > 0 ? `${posts.length} · ${published} yayında` : `${posts.length} · taslak`,
      });
    } catch {
      // Rozetler yardımcı bilgidir; okunamazsa panel yine de çalışır.
    }
  }, []);

  // Firebase Auth harici bir sistem; oturum durumu değiştiğinde içeriği de burada çekiyoruz.
  //
  // Yönetici yetkisi `admin` custom claim'i olarak ID token'ın içine gömülüdür.
  // Token bir saate kadar önbellekte kalabildiği için, yetkisi yeni verilmiş bir
  // hesap çıkış yapmadan yetkili görünmez. `getIdTokenResult(true)` token'ı
  // zorla tazeler; böylece sayfayı yenilemek yeterli olur.
  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
    setUser(nextUser);

    if (!nextUser) {
      setIsAdmin(false);
      setAuthReady(true);
      return;
    }

    let admin = false;
    try {
      const token = await nextUser.getIdTokenResult(true);
      admin = token.claims.admin === true;
    } catch {
      admin = false;
    }

    setIsAdmin(admin);
    setAuthReady(true);

    if (admin) {
      void loadContent();
      void loadBadges();
    } else {
      setIsLoading(false);
    }
  }), [loadContent, loadBadges]);

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

  if (!authReady) {
    return <main className="grid min-h-dvh place-items-center bg-[#181a18] text-sm text-white/55">Oturum kontrol ediliyor...</main>;
  }

  if (!user) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#181a18] px-5 text-[#f6f1eb]">
        <section className="w-full max-w-md border border-white/10 bg-[#202320] p-7 sm:p-10">
          <p className="eyebrow text-[#d8b792]">Elys Prime</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-.03em]">Yönetim paneli</h1>
          <p className="mt-3 text-sm leading-6 text-white/45">Devam etmek için yönetici hesabınızla giriş yapın.</p>
          <form onSubmit={login} className="mt-8">
            <label className={labelClass}>
              E-posta
              <input autoFocus autoComplete="username" type="email" className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className={`${labelClass} mt-4`}>
              Şifre
              <input autoComplete="current-password" type="password" className={inputClass} value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {accessError && <p role="alert" className="mt-3 text-xs leading-5 text-red-300">{accessError}</p>}
            <button disabled={isCheckingAccess || !email.trim() || !password} className={`${primaryButtonClass} mt-5 w-full justify-center py-4`}>
              {isCheckingAccess ? "Kontrol ediliyor..." : "Panele gir"}
            </button>
          </form>
          <Link href="/" className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-white/45 hover:text-white">
            <ChevronLeft size={14} /> Siteye dön
          </Link>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#181a18] px-5 text-[#f6f1eb]">
        <section className="w-full max-w-lg border border-white/10 bg-[#202320] p-7 sm:p-10">
          <p className="eyebrow text-[#d8b792]">Elys Prime</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-.03em]">Bu hesabın yönetici yetkisi yok</h1>
          <p className="mt-4 text-sm leading-7 text-white/55">
            <strong className="text-white/80">{user.email}</strong> ile giriş yapıldı, ancak bu hesapta
            yönetici yetkisi tanımlı değil. Yetki verildikten sonra bu sayfayı yenilemeniz yeterlidir.
          </p>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-white/35">Yetki vermek için</p>
          <pre className="mt-2 overflow-x-auto border border-white/10 bg-[#181a18] p-4 text-[11px] leading-6 text-white/60">
{`npm run set-admin -- ${user.email}`}
          </pre>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => window.location.reload()} className={primaryButtonClass}>Yeniden dene</button>
            <button type="button" onClick={logout} className={buttonClass}><LogOut size={14} /> Çıkış yap</button>
            <Link href="/" className={buttonClass}><ChevronLeft size={14} /> Siteye dön</Link>
          </div>
        </section>
      </main>
    );
  }

  if (isLoading) {
    return <main className="grid min-h-dvh place-items-center bg-[#181a18] text-sm text-white/55">Panel verileri yükleniyor...</main>;
  }

  const current = sections.find((section) => section.id === active) ?? sections[0];

  const nav = (
    <nav className="space-y-7">
      {(["İçerik", "Yayın"] as const).map((group) => (
        <div key={group}>
          <p className="px-4 text-[9px] font-bold uppercase tracking-[.2em] text-white/25">{group}</p>
          <ul className="mt-2 space-y-px">
            {sections.filter((section) => section.group === group).map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => { setActive(section.id); setMenuOpen(false); }}
                  aria-current={active === section.id ? "page" : undefined}
                  className={`flex w-full items-center justify-between gap-3 border-l-2 px-4 py-3 text-left transition ${
                    active === section.id
                      ? "border-[#d8b792] bg-[#d8b792]/10 text-[#f6f1eb]"
                      : "border-transparent text-white/55 hover:bg-white/[.04] hover:text-white"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold">{section.label}</span>
                    <span className="mt-0.5 block truncate text-[10px] leading-4 text-white/30">{section.hint}</span>
                  </span>
                  {badges[section.id] && (
                    <span className="shrink-0 whitespace-nowrap text-[9px] font-bold uppercase tracking-[.1em] text-[#d8b792]/70">
                      {badges[section.id]}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-[#181a18] text-[#f6f1eb] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-white/10 lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-5 py-5 lg:px-4">
          <Link href="/" className="min-w-0">
            <p className="display-font truncate text-xl font-semibold">Elys Prime</p>
            <p className="text-[8px] font-bold uppercase tracking-[.22em] text-white/40">Yönetim Paneli</p>
          </Link>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Menüyü aç veya kapat" aria-expanded={menuOpen} className="border border-white/15 p-2.5 lg:hidden">
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <div className={`${menuOpen ? "block" : "hidden"} pb-5 lg:block`}>
          {nav}

          <div className="mt-8 border-t border-white/10 px-4 pt-5">
            <p className="truncate text-[10px] font-bold uppercase tracking-[.12em] text-white/30">{user.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/" className={buttonClass}><ChevronLeft size={13} /> Siteye dön</Link>
              <button type="button" onClick={logout} aria-label="Çıkış yap" className="border border-white/15 p-3 transition hover:bg-[#292c29]">
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="eyebrow text-[#d8b792]">{current.group}</p>
          <h1 className="mt-3 text-3xl font-medium tracking-[-.035em] sm:text-4xl">{current.label}</h1>
        </header>

        {dataError && <p role="alert" className="mb-6 border border-red-300/25 bg-red-300/10 px-5 py-4 text-sm text-red-200">{dataError}</p>}

        {active === "genel" && <GeneralEditor content={content} setContent={setContent} />}
        {active === "hero-videolari" && <HeroVideosEditor />}
        {active === "kampanyalar" && <CampaignsEditor />}
        {active === "galeri" && <GalleryEditor />}
        {active === "belgeler" && <DocumentsEditor />}
        {active === "daire-tipleri" && <PlanRoomsEditor />}
        {active === "sayfalar" && <PagesEditor />}
        {active === "icerikler" && <PostsEditor />}
      </main>
    </div>
  );
}
