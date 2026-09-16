import Link from "next/link";
import { pageNav } from "@/components/PageShell";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#181a18] px-5 text-[#f6f1eb]">
      <div className="w-full max-w-lg text-center">
        <p className="eyebrow justify-center text-[#d8b792]">404</p>
        <h1 className="display-font mt-5 text-4xl font-medium tracking-[-.04em] sm:text-6xl">Aradığınız sayfa bulunamadı.</h1>
        <p className="mt-5 text-sm leading-7 text-white/50">
          Bağlantı değişmiş ya da sayfa kaldırılmış olabilir. Aşağıdaki bölümlerden devam edebilirsiniz.
        </p>
        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="bg-[#d8b792] px-5 py-4 text-[10px] font-bold uppercase tracking-[.14em] text-[#181a18] transition-colors hover:bg-white">
            Ana sayfa
          </Link>
          {pageNav.map((item) => (
            <Link key={item.href} href={item.href} className="border border-white/20 px-5 py-4 text-[10px] font-bold uppercase tracking-[.14em] transition-colors hover:bg-white hover:text-[#181a18]">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
