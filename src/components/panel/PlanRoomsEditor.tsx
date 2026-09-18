"use client";
import SectionEditor from "./SectionEditor";
import ImageField from "./ImageField";
import { blockNames, floorTypes, planTitle, positionTypes, roomTypes } from "@/lib/plans";
import { inputClass, labelClass } from "./ui";

/** Tek bir plan alanı için seçim kutusu — dört alan da aynı biçimde çalışıyor. */
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

export default function PlanRoomsEditor() {
  return (
    <SectionEditor
      id="plan-rooms"
      description="16 daire tipinin plan çizimi ve künyesi. Görseli değiştirebilir, yanlış eşleşmiş blok, kat ya da konum bilgisini buradan düzeltebilirsiniz. Oda tipi eşleştirmesi plan çizimlerinden türetilmiş bir VARSAYIMDIR — onaylı proje dosyasıyla teyit edilmeden yayına alınmamalı; yanlış oda sayısı arama sonuçlarında yanlış kitleyi çeker. Plan listesi ve adresler (slug) sabittir: kayıt eklenip silinemez, yalnızca düzeltilir."
      itemTitle={(item) => planTitle(item)}
      revalidatePaths={["/", "/daire-planlari"]}
      reorderable={false}
      addable={false}
      renderItem={(item, update) => (
        <>
          <ImageField
            label="Plan çizimi"
            url={item.image}
            alt={item.imageAlt}
            onChange={({ url, alt }) => update({ ...item, image: url, imageAlt: alt })}
          />

          <p className="mt-3 text-[11px] leading-5 text-white/30">
            Görsel boş bırakılırsa koddaki varsayılan plan çizimi kullanılır. Alternatif metin boşsa
            &ldquo;{planTitle(item)} daire planı&rdquo; olarak yazılır.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Select label="Blok" value={item.block} options={blockNames} onChange={(block) => update({ ...item, block })} />
            <Select label="Kat tipi" value={item.floor} options={floorTypes} onChange={(floor) => update({ ...item, floor })} />
            <Select label="Konum" value={item.position} options={positionTypes} onChange={(position) => update({ ...item, position })} />
            <Select label="Oda tipi" hint="(filtre)" value={item.rooms} options={roomTypes} onChange={(rooms) => update({ ...item, rooms })} />
          </div>

          <p className="mt-4 text-[11px] leading-5 text-white/30">
            Sayfa adresi: <span className="text-white/45">/daire-planlari/{item.slug}</span>
          </p>
        </>
      )}
    />
  );
}
