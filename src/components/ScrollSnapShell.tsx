"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { extraPageLinks } from "@/lib/nav";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type NavItem = { id: string; label: string };

export default function ScrollSnapShell({ navItems, children }: { navItems: NavItem[]; children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const mainRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const updateActiveSection = () => {
      const viewportCenter = main.getBoundingClientRect().top + main.clientHeight / 2;
      const sectionIds = ["giris", ...navItems.map((item) => item.id)];
      let closestId = "";
      let closestDistance = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const bounds = section.getBoundingClientRect();
        const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = id;
        }
      });

      setActiveId(closestId === "giris" ? "" : closestId);
      frameRef.current = null;
    };

    const scheduleUpdate = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    main.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      main.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [navItems]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return <>
    <header className={`fixed inset-x-0 top-0 z-50 text-white transition-all duration-500 ${scrolled ? "bg-[#181a18]/90 shadow-[0_1px_0_rgba(255,255,255,.10)] backdrop-blur-xl" : ""}`}>
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-9 lg:px-14">
        <button onClick={() => go("giris")} className="group flex items-center gap-3 text-left" aria-label="Ana sayfa">
          <Image src="/elysprime-logo.png" alt="Elys Prime logosu" width={1040} height={812} priority className="h-10 w-auto shrink-0 sm:h-11" />
          <span><span className="display-font block text-xl font-semibold leading-none tracking-wide">ELYS PRIME</span><span className="mt-1 block text-[8px] font-bold tracking-[.25em] opacity-60">BULKİ YAPI</span></span>
        </button>
        <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
          {navItems.map((item) => <button key={item.id} onClick={() => go(item.id)} aria-current={activeId === item.id ? "page" : undefined} className={`relative py-2 text-[11px] font-bold uppercase tracking-[.15em] transition-opacity hover:opacity-100 ${activeId === item.id ? "opacity-100" : "opacity-75"}`}>{item.label}<span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-px origin-center bg-[#d8b792] transition-transform duration-500 ease-out ${activeId === item.id ? "scale-x-100" : "scale-x-0"}`}/></button>)}
          <span aria-hidden="true" className="h-4 w-px bg-white/20" />
          {extraPageLinks.map((item) => <Link key={item.href} href={item.href} className="py-2 text-[11px] font-bold uppercase tracking-[.15em] opacity-60 transition-opacity hover:opacity-100">{item.label}</Link>)}
          <button onClick={() => go("iletisim")} className="shrink-0 border border-white/45 px-4 py-3 text-[10px] font-bold uppercase tracking-[.16em] transition-colors hover:bg-[#d8b792] hover:text-[#181a18]">Randevu Al</button>
        </nav>
        <button onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center lg:hidden" aria-label="Menüyü aç veya kapat">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="max-h-[70dvh] overflow-y-auto border-t border-white/10 bg-[#181a18] px-5 py-5 text-white lg:hidden">{navItems.map((item) => <button key={item.id} onClick={() => go(item.id)} aria-current={activeId === item.id ? "page" : undefined} className="relative block w-full border-b border-white/10 py-4 text-left text-xs font-bold uppercase tracking-[.16em]">{item.label}<span aria-hidden="true" className={`absolute bottom-0 left-1/2 h-px w-full origin-center -translate-x-1/2 bg-[#d8b792] transition-transform duration-500 ease-out ${activeId === item.id ? "scale-x-100" : "scale-x-0"}`}/></button>)}{extraPageLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block w-full border-b border-white/10 py-4 text-left text-xs font-bold uppercase tracking-[.16em] opacity-65">{item.label}</Link>)}</div>}
    </header>
    <main ref={mainRef} onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 40)} className="h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain no-scrollbar">{children}</main>
  </>;
}
