# Elys Prime — Bulki Yapı

Pendik'teki Elys Prime konut projesinin tanıtım sitesi ve içerik yönetim paneli.

- **Framework:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4
- **Barındırma:** Firebase App Hosting (Cloud Run)
- **Veri:** Cloud Firestore — sunucuda Admin SDK ile okunur, panelden Auth'lu olarak yazılır
- **Medya:** Firebase Storage + `next/image` optimizasyonu

## Geliştirme

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sunucu tarafı Firestore okuması lokalde kimlik bilgisi ister. Firebase Console →
Proje ayarları → Servis hesapları bölümünden bir anahtar indirip
`GOOGLE_APPLICATION_CREDENTIALS` ile gösterin. Kimlik bilgisi yoksa site
`src/data/project-status.json` içindeki varsayılanlarla çalışır — geliştirme
için çoğu zaman bu yeterlidir.

## Yapı

```
src/
  app/            Next.js route'ları (7 public sayfa + /panel + sitemap/robots/og)
  components/     Ortak bileşenler (PageShell, ScrollSnapShell, PanelClient)
  sections/       Ana sayfanın scroll-snap bölümleri
  lib/            Firestore erişimi, medya URL'leri, daire planı kataloğu, SEO şemaları
  data/           project-status.json (varsayılan veriler) + copy.ts (sayfa metinleri)
  assets/         Storage'a yüklenen kaynak dosyalar — build'e dahil edilmez
```

## Sayfalar

| Route | İçerik |
|---|---|
| `/` | Scroll-snap ana sayfa |
| `/proje` | Proje künyesi ve mimari yaklaşım |
| `/proje-durumu` | Güncel inşaat durumu, blok bazlı tablo, galeri |
| `/daire-planlari` | 16 daire tipinin listesi |
| `/daire-planlari/[slug]` | Her tipin kendi sayfası |
| `/konum` | Konum, ulaşım süreleri, harita |
| `/iletisim` | Satış ekibi iletişim bilgileri |
| `/panel` | İçerik yönetim paneli (noindex) |

Sayfa metinleri `src/data/copy.ts` içinde toplanmıştır; kod değiştirmeden
düzenlenebilir.

## Medyayı Storage'a yükleme

`src/assets` altındaki görseller ve video tek seferlik bir script ile yüklenir:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/yol/servis-hesabi.json node scripts/upload-media.mjs
```

Ardından Storage kurallarını yayınlayın:

```bash
firebase deploy --only storage
```

## Panel erişimi

Panel Firebase Authentication (e-posta/şifre) kullanır. Yeni bir yönetici için:

1. Firebase Console → Authentication → Users → kullanıcı ekleyin.
2. Firestore'da `admins/{uid}` dokümanını oluşturun (içerik boş olabilir).

`admins` koleksiyonu istemciden okunamaz; yalnızca Firestore Rules ve Admin SDK
erişir. Panelden kaydedildiğinde `/api/revalidate` çağrılır ve ISR sayfaları
tazelenir.

## Deploy

Site **Firebase App Hosting** üzerinde çalışır ve GitHub'daki `main` branch'ine
push ile otomatik deploy olur. Yapılandırma `apphosting.yaml` dosyasındadır.

Firestore ve Storage kuralları ayrıca yayınlanır:

```bash
npm run deploy
```
