"use client";
import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import SectionEditor from "./SectionEditor";
import ImageField from "./ImageField";
import {
  blockNames,
  floorTypes,
  formatArea,
  planHeading,
  planImage,
  planIndoorArea,
  planOutdoorArea,
  planTitle,
  positionTypes,
  roomLevels,
  roomTypes,
  type Plan,
  type PlanAreas,
  type PlanRoom,
} from "@/lib/plans";
import { emptyPlanRoom } from "@/lib/sections";
import { buttonClass, inputClass, labelClass } from "./ui";

/** Tek bir plan alanı için seçim kutusu — blok, kat, konum ve oda tipi aynı biçimde çalışıyor. */
function Select<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint?: string;
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
}) {
  return (
    <label className={labelClass}>
      {label} {hint && <span className="text-white/25">{hint}</span>}
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

/**
 * Metrekare girişi. Boş bırakmak "bilinmiyor" (null) anlamına gelir —
 * brüt alan gibi plan çiziminde yazmayan değerler için gerekli.
 */
function AreaInput({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number | null;
  onChange: (next: number | null) => void;
}) {
  return (
    <label className={labelClass}>
      {label} {hint && <span className="text-white/25">{hint}</span>}
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step={0.01}
        placeholder="—"
        className={inputClass}
        value={value ?? ""}
        onChange={(event) => onChange(parseArea(event.target.value))}
      />
    </label>
  );
}

/** Boş giriş ve geçersiz sayı "bilinmiyor" (null) demektir. */
function parseArea(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

/** Başlıklı bölüm ayracı — modal içindeki alanları gruplar. */
function Fieldset({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mt-8 border-t border-white/10 pt-6 first:mt-0 first:border-0 first:pt-0">
      <h4 className="text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">{title}</h4>
      {note && <p className="mt-2 max-w-2xl text-[11px] leading-5 text-white/30">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Paragraf ya da madde listesi — ekle/sil ile yönetilen metin dizisi. */
function TextList({
  value,
  onChange,
  placeholder,
  addLabel,
  rows,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  addLabel: string;
  rows?: number;
}) {
  const replace = (index: number, next: string) =>
    onChange(value.map((current, currentIndex) => (currentIndex === index ? next : current)));

  return (
    <>
      <div className="space-y-2">
        {value.map((entry, index) => (
          <div key={index} className="flex gap-2">
            {rows ? (
              <textarea rows={rows} className={`${inputClass} mt-0`} placeholder={placeholder} value={entry} onChange={(event) => replace(index, event.target.value)} />
            ) : (
              <input className={`${inputClass} mt-0`} placeholder={placeholder} value={entry} onChange={(event) => replace(index, event.target.value)} />
            )}
            <button
              type="button"
              aria-label="Satırı sil"
              onClick={() => onChange(value.filter((_, currentIndex) => currentIndex !== index))}
              className="shrink-0 self-start border border-white/15 px-3 py-3 text-red-300 transition hover:bg-[#292c29]"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...value, ""])} className={`${buttonClass} mt-3`}>
        <Plus size={13} /> {addLabel}
      </button>
    </>
  );
}

/** Oda oda ölçü tablosu — plan çizimindeki her mekân bir satır. */
function RoomTable({ rooms, onChange }: { rooms: PlanRoom[]; onChange: (next: PlanRoom[]) => void }) {
  const replace = (index: number, next: PlanRoom) =>
    onChange(rooms.map((room, roomIndex) => (roomIndex === index ? next : room)));

  return (
    <>
      <div className="space-y-2">
        {rooms.map((room, index) => (
          // Dar ekranda oda adı üstte tam satır, diğer alanlar altında; sm'den itibaren tek satır.
          <div
            key={index}
            className="grid gap-2 border-b border-white/[.07] pb-3 last:border-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_6rem_8.5rem_auto] sm:items-center sm:border-0 sm:pb-0"
          >
            <input
              className={`${inputClass} mt-0`}
              placeholder="Oda adı (Salon, Mutfak…)"
              value={room.name}
              onChange={(event) => replace(index, { ...room, name: event.target.value })}
            />

            <div className="grid grid-cols-[6rem_minmax(0,1fr)_auto] items-center gap-2 sm:contents">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.01}
                placeholder="m²"
                className={`${inputClass} mt-0`}
                value={room.area ?? ""}
                onChange={(event) => replace(index, { ...room, area: parseArea(event.target.value) })}
              />
              <select
                className={`${inputClass} mt-0`}
                aria-label="Kat"
                value={room.level}
                onChange={(event) => replace(index, { ...room, level: event.target.value })}
              >
                {roomLevels.map((level) => (
                  <option key={level || "tek-kat"} value={level}>{level || "Tek kat"}</option>
                ))}
              </select>
              <div className="flex shrink-0 items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-white/45" title="Balkon ve teras net alana katılmaz">
                  <input
                    type="checkbox"
                    checked={room.outdoor}
                    onChange={(event) => replace(index, { ...room, outdoor: event.target.checked })}
                    className="accent-[#d8b792]"
                  />
                  Dış
                </label>
                <button
                  type="button"
                  aria-label="Odayı sil"
                  onClick={() => onChange(rooms.filter((_, roomIndex) => roomIndex !== index))}
                  className="border border-white/15 px-3 py-3 text-red-300 transition hover:bg-[#292c29]"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...rooms, emptyPlanRoom()])} className={`${buttonClass} mt-3`}>
        <Plus size={13} /> Oda ekle
      </button>
    </>
  );
}

export default function PlanRoomsEditor() {
  return (
    <SectionEditor
      id="plan-rooms"
      variant="rows"
      description="16 daire tipinin plan çizimi, künyesi, metrekareleri ve sayfa metinleri. Satıra tıklayarak o tipin düzenleme penceresini açın. Ölçüler plan çizimlerinden okunmuştur; onaylı proje dosyasıyla teyit edilmeden yayına alınmamalı. Plan listesi ve adresler (slug) sabittir: kayıt eklenip silinemez, yalnızca düzeltilir. Değişiklikler alttaki Kaydet'e basılınca yayına alınır."
      itemTitle={(item) => planHeading(item)}
      rowImage={(item) => planImage(item)}
      rowMeta={(item) =>
        [`${item.block} Blok`, item.floor, item.position, item.rooms, formatArea(item.areas.netArea) && `${formatArea(item.areas.netArea)} net`]
          .filter(Boolean)
          .join(" · ")
      }
      revalidatePaths={["/", "/daire-planlari"]}
      reorderable={false}
      addable={false}
      renderItem={(item, update) => {
        const updateAreas = (next: Partial<PlanAreas>) => update({ ...item, areas: { ...item.areas, ...next } });
        const indoor = planIndoorArea(item);
        const outdoor = planOutdoorArea(item);
        const netMismatch = item.areas.netArea !== null && Math.abs(item.areas.netArea - indoor) > 0.011;

        return (
          <>
            <Fieldset title="Plan çizimi">
              <ImageField
                label="Görsel"
                url={item.image}
                alt={item.imageAlt}
                onChange={({ url, alt }) => update({ ...item, image: url, imageAlt: alt })}
              />
              <p className="mt-3 text-[11px] leading-5 text-white/30">
                Görsel boş bırakılırsa koddaki varsayılan plan çizimi kullanılır. Alternatif metin boşsa
                &ldquo;{planTitle(item)} daire planı&rdquo; olarak yazılır.
              </p>
            </Fieldset>

            <Fieldset title="Künye" note="Blok, kat ve konum hem filtrelerde hem sayfa başlığında kullanılır. Oda tipi ana sayfadaki filtre çiplerini besler.">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Select label="Blok" value={item.block} options={blockNames} onChange={(block) => update({ ...item, block })} />
                <Select label="Kat tipi" value={item.floor} options={floorTypes} onChange={(floor) => update({ ...item, floor })} />
                <Select label="Konum" value={item.position} options={positionTypes} onChange={(position) => update({ ...item, position })} />
                <Select label="Oda tipi" hint="(filtre)" value={item.rooms} options={roomTypes} onChange={(rooms) => update({ ...item, rooms })} />
              </div>
              <label className={`${labelClass} mt-5 block`}>
                Oda dağılımı <span className="text-white/25">(serbest metin: &ldquo;3+1 (3 oda + 1 salon)&rdquo;)</span>
                <input className={inputClass} value={item.roomLayout} onChange={(event) => update({ ...item, roomLayout: event.target.value })} />
              </label>
              <p className="mt-4 text-[11px] leading-5 text-white/30">
                Sayfa adresi: <span className="text-white/45">/daire-planlari/{item.slug}</span>
              </p>
            </Fieldset>

            <Fieldset
              title="Metrekare"
              note="Net alan, aşağıdaki oda listesindeki kapalı mekânların toplamıdır. Brüt alan plan çizimlerinde yazmadığı için boştur; onaylı proje dosyasından öğrenildiğinde buraya girilir. Boş bırakılan alan sitede gösterilmez."
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <AreaInput label="Net alan" value={item.areas.netArea} onChange={(netArea) => updateAreas({ netArea })} />
                <AreaInput label="Brüt alan" hint="(opsiyonel)" value={item.areas.grossArea} onChange={(grossArea) => updateAreas({ grossArea })} />
                <AreaInput label="Balkon" value={item.areas.balconyArea} onChange={(balconyArea) => updateAreas({ balconyArea })} />
                <AreaInput label="Teras" value={item.areas.terraceArea} onChange={(terraceArea) => updateAreas({ terraceArea })} />
              </div>

              <p className="mt-4 text-[11px] leading-5 text-white/35">
                Oda listesi toplamı: <span className="text-white/60">{formatArea(indoor) || "—"}</span> kapalı
                {outdoor > 0 && <> · <span className="text-white/60">{formatArea(outdoor)}</span> dış mekân</>}
              </p>

              {netMismatch && (
                <p className="mt-2 flex flex-wrap items-center gap-3 border border-[#d8b792]/30 bg-[#d8b792]/10 px-4 py-3 text-[11px] leading-5 text-[#e8cfae]">
                  Girilen net alan ({formatArea(item.areas.netArea)}) oda listesi toplamıyla ({formatArea(indoor)}) uyuşmuyor.
                  <button type="button" onClick={() => updateAreas({ netArea: indoor })} className={buttonClass}>
                    Toplamı kullan
                  </button>
                </p>
              )}
            </Fieldset>

            <Fieldset
              title="Oda ölçüleri"
              note="Plan çizimindeki her mekân bir satır. &ldquo;Dış&rdquo; işaretli satırlar (balkon, teras) net alan toplamına katılmaz. Dubleks planlarda kat seçimi odaları Giriş Katı / Üst Kat olarak gruplar."
            >
              <RoomTable rooms={item.roomList} onChange={(roomList) => update({ ...item, roomList })} />
            </Fieldset>

            <Fieldset title="Sayfa metni" note="Bu alanlar /daire-planlari/... sayfasının başlığını ve gövdesini oluşturur.">
              <div className="grid gap-5 lg:grid-cols-2">
                <label className={labelClass}>
                  Sayfa başlığı (H1)
                  <input className={inputClass} value={item.title} onChange={(event) => update({ ...item, title: event.target.value })} />
                </label>
                <label className={labelClass}>
                  Giriş cümlesi
                  <input className={inputClass} value={item.lead} onChange={(event) => update({ ...item, lead: event.target.value })} />
                </label>
              </div>

              <div className="mt-5">
                <span className={labelClass}>Özellikler <span className="text-white/25">(künye çipleri)</span></span>
                <div className="mt-2">
                  <TextList
                    value={item.features}
                    onChange={(features) => update({ ...item, features })}
                    placeholder="Örn: İki cepheli plan"
                    addLabel="Özellik ekle"
                  />
                </div>
              </div>

              <div className="mt-6">
                <span className={labelClass}>Paragraflar</span>
                <div className="mt-2">
                  <TextList
                    value={item.description}
                    onChange={(description) => update({ ...item, description })}
                    placeholder="Plan hakkında açıklama"
                    addLabel="Paragraf ekle"
                    rows={4}
                  />
                </div>
              </div>
            </Fieldset>

            <Fieldset title="Arama motoru" note="Boş bırakılırsa sayfa başlığı ve giriş cümlesi kullanılır. Başlık için 60, açıklama için 160 karakter üst sınırdır.">
              <div className="grid gap-5 lg:grid-cols-2">
                <label className={labelClass}>
                  SEO başlığı <SeoCount value={item.seoTitle} limit={60} />
                  <input className={inputClass} value={item.seoTitle} onChange={(event) => update({ ...item, seoTitle: event.target.value })} />
                </label>
                <label className={labelClass}>
                  SEO açıklaması <SeoCount value={item.seoDescription} limit={160} />
                  <textarea rows={3} className={inputClass} value={item.seoDescription} onChange={(event) => update({ ...item, seoDescription: event.target.value })} />
                </label>
              </div>
            </Fieldset>
          </>
        );
      }}
    />
  );
}

/** Karakter sayacı — sınır aşılınca uyarı rengine döner. */
function SeoCount({ value, limit }: { value: string; limit: number }) {
  const over = value.length > limit;
  return (
    <span className={over ? "text-red-300" : "text-white/25"}>
      ({value.length}/{limit})
    </span>
  );
}

/** Tip kontrolü: editörün `Plan` kaydıyla çalıştığını derleme anında doğrular. */
export type PlanRoomsItem = Plan;
