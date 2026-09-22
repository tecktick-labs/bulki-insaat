/**
 * Alt sayfa metinlerinin taslaklarını ve başlangıç blog/tanıtım içeriklerini
 * Firestore'a yazar. Sonrasında hepsi panelden düzenlenir.
 *
 * Kullanım:
 *   GOOGLE_APPLICATION_CREDENTIALS=/yol/servis-hesabi.json node scripts/seed-content.mjs
 *   ... node scripts/seed-content.mjs --force   (mevcut kayıtların üzerine yazar)
 *
 * Varsayılan davranış güvenlidir: zaten var olan dokümanlara DOKUNMAZ, böylece
 * panelden yaptığınız düzenlemeler script tekrar çalıştırılsa bile kaybolmaz.
 */
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { defaultPages } from "../src/data/copy.ts";
import { sectionDefaults, sectionIds } from "../src/lib/sections.ts";

const force = process.argv.includes("--force");

const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!inline && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("Kimlik bilgisi yok. GOOGLE_APPLICATION_CREDENTIALS ya da FIREBASE_SERVICE_ACCOUNT_JSON tanımlayın.");
  process.exit(1);
}

const app = initializeApp(inline ? { credential: cert(JSON.parse(inline)) } : {});
const db = getFirestore(app);

const p = (text) => ({ type: "paragraph", text });
const h = (text) => ({ type: "heading", text });

/** Başlangıç içerikleri — hepsi TASLAK olarak yazılır, siz onaylayana dek yayına girmez. */
const seedPosts = [
  {
    id: "blog-daire-tipi-nasil-secilir",
    type: "blog",
    slug: "daire-tipi-nasil-secilir",
    title: "Köşe tip mi, orta tip mi? Daire tipi seçerken nelere bakmalı",
    excerpt:
      "Aynı projede yer alan köşe ve orta tip daireler günlük yaşamda birbirinden belirgin biçimde ayrışır. Hangisinin size uyduğunu anlamanın pratik yolları.",
    blocks: [
      p("Bir konut projesinde plan seçerken çoğu kişi önce metrekareye, sonra kat numarasına bakar. Oysa günlük yaşamı asıl belirleyen şey, dairenin blok içindeki konumudur: köşede mi, ortada mı."),
      h("Köşe tipler: iki cephe, daha çok ışık"),
      p("Köşe daireler blokların uç noktalarında yer alır ve iki farklı yönden ışık alır. Bu, gün boyunca evin farklı bölümlerinin aydınlanması ve hava sirkülasyonunun belirgin biçimde artması anlamına gelir. Buna karşılık pencere sayısının fazlalığı, mobilya yerleşiminde biraz daha planlama gerektirir."),
      h("Orta tipler: düzenli plan, daha iyi yalıtım"),
      p("Orta tipler tek cepheden ışık alır ama duvar yüzeyleri daha bütünlüklüdür. Bu, mobilya yerleşiminde serbestlik sağlar. Komşu dairelerle paylaşılan duvarlar ısı yalıtımına da katkı yapar; ısıtma ve soğutma maliyetleri genellikle daha düşüktür."),
      h("Peki hangisi?"),
      { type: "list", items: [
        "Evde çok vakit geçiriyor, gün ışığına önem veriyorsanız: köşe tip.",
        "Yalıtım, sessizlik ve düzenli bir plan önceliğinizse: orta tip.",
        "Kalabalık bir haneyseniz ve katları ayırmak istiyorsanız: dubleks tipleri değerlendirin.",
      ] },
      p("Elys Prime'da dört blokta toplam 16 farklı daire tipi bulunuyor. Planların tamamını inceleyip kendi yaşam düzeninize uyanı seçebilirsiniz."),
    ],
    seoTitle: "Köşe Tip mi Orta Tip mi? Daire Seçerken Nelere Bakmalı",
    seoDescription:
      "Köşe ve orta tip daireler arasındaki farklar: ışık, yalıtım, plan düzeni ve mobilya yerleşimi. Hangisinin size uygun olduğunu anlamanın pratik yolları.",
  },
  {
    id: "blog-sultanbeyli-de-yasam",
    type: "blog",
    slug: "sultanbeylide-yasam-ve-ulasim",
    title: "Sultanbeyli'de yaşam: ulaşım, çevre ve günlük hayat",
    excerpt:
      "İstanbul'da konut seçerken ulaşım süresi, dairenin kendisi kadar belirleyicidir. Sultanbeyli'nin gelişen bölgesinde günlük hayat nasıl işliyor?",
    blocks: [
      p("İstanbul'da ev seçerken sorulması gereken ilk soru şu: sabah işe çıktığınızda kapıdan çıkıp kaç dakikada toplu taşımaya ulaşıyorsunuz? Bu tek soru, bir konutun günlük yaşam kalitesi hakkında metrekareden daha fazlasını anlatır."),
      h("Raylı sisteme yürüme mesafesi"),
      p("Sultanbeyli'nin gelişen yaşam bölgesi, metro ve otobüs hatlarına yürüme mesafesinde konumlanıyor. Bu, günlük ulaşımı araca bağımlı olmaktan çıkarıyor ve özellikle trafiğin yoğun olduğu saatlerde ciddi bir zaman farkı yaratıyor."),
      h("Çevredeki altyapı"),
      p("Sultanbeyli, son yıllarda İstanbul'un en hızlı dönüşen ilçelerinden biri. Sağlık, eğitim ve alışveriş altyapısı yerleşik durumda. Bölgedeki yeni konut projeleri ise çevrenin genel yaşam standardını yukarı çekiyor."),
      p("Elys Prime'ın konumu ve çevredeki noktalara olan mesafeleri konum sayfasından harita üzerinde inceleyebilirsiniz."),
    ],
    seoTitle: "Sultanbeyli'de Yaşam: Ulaşım, Çevre ve Günlük Hayat",
    seoDescription:
      "Sultanbeyli'de konut seçerken ulaşım süreleri, çevredeki altyapı ve günlük yaşam. Raylı sisteme yürüme mesafesindeki konumun günlük hayata etkisi.",
  },
  {
    id: "blog-insaat-asamasinda-konut",
    type: "blog",
    slug: "insaat-asamasinda-konut-almak",
    title: "İnşaat aşamasındaki bir projeden daire almak: nelere dikkat etmeli",
    excerpt:
      "Proje aşamasında daire almak avantajlı olabilir, ama doğru soruları sormayı gerektirir. Sürecin adımları ve dikkat edilmesi gerekenler.",
    blocks: [
      p("Tamamlanmamış bir projeden daire almak, hazır konuta göre farklı bir karar sürecidir. Gördüğünüz şey bir daire değil, bir vaattir; bu yüzden vaadin arkasındaki verilere bakmak gerekir."),
      h("Sorulması gereken sorular"),
      { type: "list", items: [
        "Projenin güncel tamamlanma oranı nedir ve bu oran nasıl ölçülüyor?",
        "Hangi bloklar hangi aşamada? Blok bazlı ilerleme paylaşılıyor mu?",
        "Onaylı proje dosyası ve ruhsat belgeleri incelemeye açık mı?",
        "Daire tipi başına net ve brüt alanlar yazılı olarak veriliyor mu?",
        "Şantiye ziyareti mümkün mü?",
      ] },
      h("Şeffaflık en iyi göstergedir"),
      p("Bir yapı firmasının inşaat durumunu düzenli ve açık biçimde paylaşması, kendi başına anlamlı bir güven göstergesidir. Elys Prime'da tamamlanma oranı, satılan daire sayısı ve blok bazlı doluluk bilgileri satış ekibiyle açık biçimde paylaşılır."),
      p("Daireleri yerinde görmek ve süreci ayrıntılı konuşmak için satış ekibimizden randevu alabilirsiniz."),
    ],
    seoTitle: "İnşaat Aşamasındaki Projeden Daire Almak: Dikkat Edilecekler",
    seoDescription:
      "Proje aşamasında konut alırken sorulması gereken sorular: tamamlanma oranı, blok bazlı ilerleme, onaylı proje dosyası ve şantiye ziyareti.",
  },
  {
    id: "tanitim-elys-prime-genel",
    type: "tanitim",
    slug: "elys-prime-proje-tanitimi",
    title: "Elys Prime proje tanıtımı",
    excerpt:
      "Dört blok, 192 daire ve 35.000 m² inşaat alanıyla Sultanbeyli'de yükselen Elys Prime'ın genel tanıtımı.",
    blocks: [
      p("Elys Prime; Bulki Yapı güvencesiyle Sultanbeyli'de yükselen, dört bloktan ve 192 daireden oluşan bir yaşam projesidir. Toplam 35.000 m² inşaat alanına yayılan proje, modern mimariyi geniş peyzaj alanlarıyla bir araya getirir."),
      h("Projeyi tanımlayan başlıklar"),
      { type: "list", items: [
        "4 blok, blok başına 48 daire, toplam 192 daire",
        "35.000 m² inşaat alanı",
        "16 farklı daire tipi: normal kat köşe ve orta, çatı katı, dubleks",
        "İç bahçeler, avlular, spor ve çocuk oyun alanları",
        "Metroya 5 dakika, otobüs durağına 2 dakika yürüme mesafesi",
      ] },
      h("Daire tipleri"),
      p("A ve C bloklarda üst kat çatı katı olarak, B ve D bloklarda dubleks olarak tasarlandı. Bu dağılım, aynı proje içinde birbirinden belirgin biçimde farklı yaşam alanları sunuyor. Tüm planları daire planları sayfasından inceleyebilirsiniz."),
      p("Bu tanıtım bilgilendirme amaçlıdır. Onaylı proje dosyası ve teknik detaylar için satış ekibimizle iletişime geçebilirsiniz."),
    ],
    seoTitle: "Elys Prime Proje Tanıtımı",
    seoDescription:
      "Elys Prime tanıtımı: Sultanbeyli'de 4 blok, 192 daire, 35.000 m² inşaat alanı, 16 daire tipi ve toplu taşımaya yürüme mesafesinde konum.",
  },
];

let written = 0;
let skipped = 0;

// --- Sayfa metinleri ---
for (const [slug, page] of Object.entries(defaultPages)) {
  const ref = db.collection("pages").doc(slug);

  if (!force && (await ref.get()).exists) {
    console.log(`- pages/${slug} zaten var, atlandı`);
    skipped += 1;
    continue;
  }

  await ref.set({ ...page, updatedAt: FieldValue.serverTimestamp() });
  console.log(`✓ pages/${slug}`);
  written += 1;
}

// --- Panelden yönetilen bölümler: kampanyalar, galeri, belgeler, daire tipleri ---
for (const id of sectionIds) {
  const ref = db.collection("sections").doc(id);

  if (!force && (await ref.get()).exists) {
    console.log(`- sections/${id} zaten var, atlandı`);
    skipped += 1;
    continue;
  }

  await ref.set({ items: sectionDefaults[id], updatedAt: FieldValue.serverTimestamp() });
  console.log(`✓ sections/${id} (${sectionDefaults[id].length} kayıt)`);
  written += 1;
}

// --- Blog ve tanıtım taslakları ---
for (const post of seedPosts) {
  const ref = db.collection("posts").doc(post.id);

  if (!force && (await ref.get()).exists) {
    console.log(`- posts/${post.id} zaten var, atlandı`);
    skipped += 1;
    continue;
  }

  const { id, ...rest } = post;
  await ref.set({
    ...rest,
    coverImage: "",
    coverAlt: "",
    published: false,
    publishedAt: Timestamp.now(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`✓ posts/${id} (taslak)`);
  written += 1;
}

console.log(`\n${written} doküman yazıldı, ${skipped} atlandı.`);
console.log("İçerikler TASLAK olarak eklendi — panelden gözden geçirip yayına alın.");
