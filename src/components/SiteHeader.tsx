"use client";
import { Home, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { pageNav } from "@/lib/nav";

/** Alt sayfaların üst menüsü. Aktif sekmeyi URL'den bulur, mobilde açılır menü sunar. */
export default function SiteHeader({ whatsappLink }: { whatsappLink: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#181a18]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-9 lg:px-14">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Elys Prime ana sayfa">
          <Image src="/elysprime-logo.png" alt="Elys Prime logosu" width={1040} height={812} priority className="h-10 w-auto shrink-0 sm:h-11" />
          <span className="hidden sm:block">
            <span className="display-font block text-xl font-semibold leading-none tracking-wide">ELYS PRIME</span>
            <span className="mt-1 block text-[8px] font-bold tracking-[.25em] opacity-60">BULKİ YAPI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {pageNav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative shrink-0 py-2 text-[11px] font-bold uppercase tracking-[.15em] transition-opacity hover:opacity-100 ${isActive ? "opacity-100" : "opacity-70"}`}
              >
                {item.href === "/" ? <span className="inline-flex items-center gap-1.5"><Home size={13}/> {item.label}</span> : item.label}
                <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-px origin-center bg-[#d8b792] transition-transform duration-500 ease-out ${isActive ? "scale-x-100" : "scale-x-0"}`}/>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="hidden shrink-0 border border-white/45 px-4 py-3 text-[10px] font-bold uppercase tracking-[.16em] transition-colors hover:bg-[#d8b792] hover:text-[#181a18] sm:inline-block">
            Randevu Al
          </a>
          <button onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center lg:hidden" aria-label="Menüyü aç veya kapat" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[70dvh] overflow-y-auto border-t border-white/10 bg-[#181a18] px-5 py-4 lg:hidden">
          {pageNav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`block w-full border-b border-white/10 py-4 text-xs font-bold uppercase tracking-[.16em] ${isActive ? "text-[#d8b792]" : "text-white/75"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-4 block border border-white/45 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[.16em]">
            Randevu Al
          </a>
        </div>
      )}
    </header>
  );
}
