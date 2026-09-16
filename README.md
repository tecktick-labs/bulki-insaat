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

Site kimlik bilgisi olmadan da çalışır: Firestore'a erişilemiyorsa
`src/data/` içindeki varsayılan metinler kullanılır ve konsola tek satırlık bir
bilgi notu düşer. Görseller Storage'dan geldiği için yüklenene kadar boş görünür.

Gerçek veriyle çalışmak için üç seçenekten biri (ayrıntılar `.env.example`):

| Seçenek | Ne zaman |
|---|---|
| `GOOGLE_APPLICATION_CREDENTIALS` ile servis hesabı anahtarı | Canlı veriyi yerelde görmek için en pratiği |
| `gcloud auth application-default login` | gcloud kuruluysa, anahtar dosyası tutmadan |
| `npm run emulators` + `NEXT_PUBLIC_USE_EMULATORS=1` | Canlı veriye hiç dokunmadan, izole geliştirme |

Canlıda hiçbirine gerek yoktur — App Hosting, Cloud Run servis hesabını
otomatik kullanır.

## Yapı

```
src/
  app/            Next.js route'ları (7 public sayfa + /panel + sitemap/robots/og)
  components/     Ortak bileşenler (PageShell, ScrollSnapShell, PanelClient)
  sections/       Ana sayfanın scroll-snap bölümleri
  lib/            Firestore erişimi, medya URL'leri, daire planı kataloğu, SEO şemaları
  data/           project-status.json (proje verileri) + copy.ts (varsayılan sayfa metinleri)
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
| `/tanitimlar` | Tanıtım ve broşür içerikleri |
| `/tanitimlar/[slug]` | Her tanıtımın kendi sayfası |
| `/blog` | Blog yazıları |
| `/blog/[slug]` | Her yazının kendi sayfası |
| `/iletisim` | Satış ekibi iletişim bilgileri |
| `/panel` | İçerik yönetim paneli (noindex) |

## İçerik yönetimi

Panelde üç sekme vardır:

- **Proje Verileri** — daire sayıları, blok durumu, iletişim bilgileri
  (`projectData/website`)
- **Sayfa Metinleri** — alt sayfaların başlık, giriş, SEO ve gövde metinleri
  (`pages/{slug}`). Gövde; ara başlık, paragraf, görsel, liste ve alıntı
  bloklarından oluşur.
- **Blog & Tanıtım** — blog yazıları ve tanıtım/broşür sayfaları (`posts`).
  Aynı blok editörü kullanılır; her içerik taslak olarak başlar ve
  yayınlandığında kendi URL'inde erişilebilir olur.

Görseller panelden doğrudan Storage'a (`uploads/`) yüklenir.

Firestore'da kayıt yoksa sayfalar `src/data/copy.ts` içindeki varsayılan
metinlerle çalışır. Taslakları Firestore'a yazmak için:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/yol/servis-hesabi.json npm run seed-content
```

Script mevcut dokümanlara dokunmaz; üzerine yazmak için `-- --force` ekleyin.

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

Panel Firebase Authentication (e-posta/şifre) kullanır. Yetki, `admin` adlı bir
custom claim olarak verilir ve hem Firestore hem Storage kurallarında okunur.

1. Firebase Console → Authentication → Users → kullanıcıyı ekleyin.
2. Yetkiyi verin:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/yol/servis-hesabi.json npm run set-admin -- eposta@ornek.com
```

Yetki değişikliğinin geçerli olması için kullanıcının panelden çıkıp tekrar
girmesi gerekir. Yetkiyi geri almak için `-- --revoke eposta@ornek.com`.

Panelden kaydedildiğinde `/api/revalidate` çağrılır ve ilgili ISR sayfaları
tazelenir.

## Deploy

Site **Firebase App Hosting** üzerinde çalışır ve GitHub'daki `main` branch'ine
push ile otomatik deploy olur. Yapılandırma `apphosting.yaml` dosyasındadır.

Firestore kuralları, Firestore indeksleri ve Storage kuralları ayrıca
yayınlanır:

```bash
npm run deploy
```

Blog/tanıtım listeleri bileşik indeks gerektirir (`firestore.indexes.json`);
bu komut onları da yayınlar.
