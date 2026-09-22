import { ImageResponse } from "next/og";

export const alt = "Elys Prime — Sultanbeyli'de yeni nesil yaşam projesi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#181a18",
          color: "#f6f1eb",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid rgba(255,255,255,.5)",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            EP
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, letterSpacing: 2 }}>ELYS PRIME</span>
            <span style={{ fontSize: 14, letterSpacing: 6, opacity: 0.6 }}>BULKİ YAPI</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 26, letterSpacing: 8, color: "#d8b792" }}>PENDİK / İSTANBUL</span>
          <span style={{ fontSize: 86, lineHeight: 1.05, marginTop: 20, maxWidth: 900 }}>
            4 blok, 192 daire, 35.000 m² yaşam alanı
          </span>
        </div>

        <div style={{ display: "flex", gap: 56, fontSize: 22, color: "rgba(246,241,235,.6)" }}>
          <span>16 farklı daire tipi</span>
          <span>Metroya 5 dk yürüme</span>
          <span>elysprime.com</span>
        </div>
      </div>
    ),
    size,
  );
}
