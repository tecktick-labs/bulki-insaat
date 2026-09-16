"use client";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { ChevronLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import GeneralEditor from "./panel/GeneralEditor";
import PagesEditor from "./panel/PagesEditor";
import PostsEditor from "./panel/PostsEditor";
import { buttonClass, inputClass, labelClass, primaryButtonClass } from "./panel/ui";
import { auth } from "@/lib/firebase";
import { projectDefaults, type ProjectContent } from "@/lib/project-content";
import { fetchProjectContent } from "@/lib/project-content.client";

const tabs = [
  { id: "genel", label: "Proje Verileri" },
  { id: "sayfalar", label: "Sayfa Metinleri" },
  { id: "icerikler", label: "Blog & Tanıtım" },
] as const;

type TabId = (typeof tabs)[number]["id"];

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
  const [tab, setTab] = useState<TabId>("genel");

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

    try {
      const token = await nextUser.getIdTokenResult(true);
      setIsAdmin(token.claims.admin === true);
    } catch {
      setIsAdmin(false);
    }

    setAuthReady(true);
    void loadContent();
  }), [loadContent]);

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
            <button type="button" onClick={() => window.location.reload()} className={primaryButtonClass}>
              Yeniden dene
            </button>
            <button type="button" onClick={logout} className={buttonClass}>
              <LogOut size={14} /> Çıkış yap
            </button>
            <Link href="/" className={buttonClass}><ChevronLeft size={14} /> Siteye dön</Link>
          </div>
        </section>
      </main>
    );
  }

  if (isLoading) {
    return <main className="grid min-h-dvh place-items-center bg-[#181a18] text-sm text-white/55">Panel verileri yükleniyor...</main>;
  }

  return (
    <main className="min-h-dvh bg-[#181a18] text-[#f6f1eb]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#181a18]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div>
            <p className="display-font text-2xl font-semibold">Elys Prime</p>
            <p className="text-[8px] font-bold uppercase tracking-[.22em] text-white/40">Yönetim Paneli</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] font-bold uppercase tracking-[.12em] text-white/35 lg:inline">{user.email}</span>
            <Link href="/" className={buttonClass}><ChevronLeft size={14} /> Siteye dön</Link>
            <button type="button" onClick={logout} aria-label="Çıkış yap" className="border border-white/15 p-3 transition hover:bg-[#292c29]">
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-1 px-5 sm:px-8">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id ? "page" : undefined}
              className={`border-b-2 px-4 py-4 text-[10px] font-bold uppercase tracking-[.13em] transition ${
                tab === item.id ? "border-[#d8b792] text-[#d8b792]" : "border-transparent text-white/45 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        {dataError && <p role="alert" className="mb-6 border border-red-300/25 bg-red-300/10 px-5 py-4 text-sm text-red-200">{dataError}</p>}

        {tab === "genel" && <GeneralEditor content={content} setContent={setContent} />}
        {tab === "sayfalar" && <PagesEditor />}
        {tab === "icerikler" && <PostsEditor />}
      </div>
    </main>
  );
}
