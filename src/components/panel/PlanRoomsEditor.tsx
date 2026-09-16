"use client";
import SectionEditor from "./SectionEditor";
import { findPlan, planTitle, roomTypes } from "@/lib/plans";
import { inputClass, labelClass } from "./ui";

export default function PlanRoomsEditor() {
  return (
    <SectionEditor
      id="plan-rooms"
      description="Daire planları sayfasındaki oda tipi filtresi. Mevcut eşleştirme plan çizimlerinden türetilmiş bir VARSAYIMDIR — onaylı proje dosyasıyla teyit edilmeden yayına alınmamalı. Yanlış oda sayısı, arama sonuçlarında yanlış kitleyi çeker ve düzeltmesi en pahalı hatalardan biridir."
      itemTitle={(item) => {
        const plan = findPlan(item.slug);
        return plan ? planTitle(plan) : item.slug;
      }}
      revalidatePaths={["/", "/daire-planlari"]}
      reorderable={false}
      addable={false}
      renderItem={(item, update) => (
        <label className={labelClass}>
          Oda tipi
          <select className={inputClass} value={item.rooms} onChange={(event) => update({ ...item, rooms: event.target.value as typeof item.rooms })}>
            {roomTypes.map((room) => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>
        </label>
      )}
    />
  );
}
