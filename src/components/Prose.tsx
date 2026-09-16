import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead: string; children?: ReactNode }) {
  return (
    <div className="border-b border-white/10">
      <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-12 sm:px-9 lg:px-14 lg:pb-16 lg:pt-16">
        {children}
        <p className="eyebrow mt-6 text-[#d8b792]">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-medium leading-[.95] tracking-[-.045em] sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">{lead}</p>
      </div>
    </div>
  );
}

export function Section({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
  return (
    <section className="border-b border-white/[.07] py-10 lg:py-14">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 sm:px-9 lg:grid-cols-[minmax(0,.4fr)_minmax(0,.6fr)] lg:gap-14 lg:px-14">
        <h2 className="display-font text-2xl font-medium leading-tight tracking-[-.03em] text-[#f6f1eb] sm:text-4xl">{heading}</h2>
        <div className="space-y-5">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-[15px] leading-8 text-white/60">{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1440px] px-5 sm:px-9 lg:px-14 ${className}`}>{children}</div>;
}

export function CallToAction({ whatsappLink, email }: { whatsappLink: string; email: string }) {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8 border border-[#d8b792]/40 bg-[#1f221f] p-8 lg:p-12">
          <div>
            <p className="eyebrow text-[#d8b792]">Satış & Randevu</p>
            <h2 className="display-font mt-4 max-w-xl text-3xl font-medium leading-tight tracking-[-.03em] sm:text-5xl">
              Daireleri yerinde görmek ister misiniz?
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/55">
              Güncel fiyat listesi, ödeme planı ve müsait daireler için satış ekibimizle görüşün.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-[#d8b792] px-6 py-4 text-[11px] font-bold uppercase tracking-[.16em] text-[#181a18] transition-colors hover:bg-white">
              WhatsApp&apos;tan yazın
            </a>
            <a href={`mailto:${email}`} className="border border-white/45 px-6 py-4 text-[11px] font-bold uppercase tracking-[.16em] transition-colors hover:bg-white hover:text-[#181a18]">
              E-posta gönderin
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
