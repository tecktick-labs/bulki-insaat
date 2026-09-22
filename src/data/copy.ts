import type { ContentBlock, PageCopy, PageSlug } from "@/lib/content-types";

/**
 * Alt sayfaların VARSAYILAN metinleri.
 *
 * Bunlar taslaktır: `scripts/seed-content.mjs` ile Firestore'a `pages/{slug}`
 * olarak yazılır ve sonrasında panelden düzenlenir. Firestore'da kayıt yoksa
 * (ya da okunamıyorsa) site bu varsayılanlarla çalışmaya devam eder.
 *
 * NOT: Fiyat bilgisi bilinçli olarak hiçbir metinde yer almıyor.
 */

const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const h = (text: string): ContentBlock => ({ type: "heading", text });

export const defaultPages: Record<PageSlug, PageCopy> = {
  proje: {
    slug: "proje",
    label: "Proje Hakkında",
    title: "Proje Hakkında",
    lead: "Elys Prime, Bulki Yapı güvencesiyle Pendik'te yükselen, dört bloktan ve 192 daireden oluşan bütüncül bir yaşam projesidir.",
    seoTitle: "Proje Hakkında",
    seoDescription:
      "Elys Prime; Pendik'te 4 blok, 192 daire ve 35.000 m² inşaat alanına sahip bir yaşam projesi. Mimari yaklaşım, blok kurgusu ve daire çeşitliliği hakkında ayrıntılar.",
    blocks: [
      h("Dört blok, tek bir yaşam kurgusu"),
      p("Elys Prime; A, B, C ve D olmak üzere dört bloktan oluşuyor ve her blok 48 daire barındırıyor. Toplam 35.000 m² inşaat alanına yayılan proje, blokları birbirinden koparan değil, ortak avlular ve peyzaj alanları üzerinden birbirine bağlayan bir yerleşim kurgusuna sahip. Böylece her daire hem kendi mahremiyetini koruyor hem de ortak yaşam alanlarına doğrudan açılıyor."),
      p("Blokların konumlanışı, dairelerin büyük bölümünün gün ışığından mümkün olduğunca uzun süre faydalanmasını gözetiyor. Köşe tipler iki cepheden ışık alırken, orta tipler daha derin ve korunaklı bir plan şemasına sahip. Çatı katı ve dubleks tipleri ise projenin en geniş yaşam alanlarını sunuyor."),
      h("Mimari yaklaşım"),
      p("Projenin mimari dili, modern ve sade çizgileri sıcak malzeme dokularıyla bir araya getiriyor. Cephede kullanılan yatay ve düşey ritim, blokların kütlesel ağırlığını kırarak insan ölçeğine yakın bir siluet oluşturuyor. Gündüz sakin ve nötr duran cepheler, akşam aydınlatmasıyla birlikte tamamen farklı bir atmosfere bürünüyor."),
      p("İç bahçeler ve avlular projenin omurgasını oluşturuyor. Peyzaj, blokların arasındaki boşlukları dolduran bir süs unsuru olarak değil, günlük yaşamın içinden geçtiği bir zemin olarak tasarlandı. Spor alanları, çocuk oyun alanları ve yürüyüş aksları bu zeminin üzerine yerleşiyor."),
      h("Kimler için"),
      p("Elys Prime, ilk evini alan çiftlerden çocuklu ailelere, yatırım amaçlı konut arayanlardan Pendik'te iş yaşamına yakın olmak isteyenlere kadar geniş bir kitleye hitap ediyor. Normal kat, çatı katı ve dubleks tipleriyle farklı hane büyüklüklerine yanıt veren bir daire çeşitliliği sunuyor."),
      p("Ulaşılabilir ödeme seçenekleri, projenin başından beri önceliklendirdiği konulardan biri. Güncel ödeme planı ve daire seçenekleri için satış ekibiyle doğrudan iletişime geçebilirsiniz."),
    ],
  },

  "daire-planlari": {
    slug: "daire-planlari",
    label: "Daire Planları",
    title: "Daire Planları",
    lead: "Elys Prime'da dört blok ve 16 farklı daire tipi bulunuyor. Her planı büyütüp inceleyebilir, kendi yaşam düzeninize uyanı seçebilirsiniz.",
    seoTitle: "Daire Planları",
    seoDescription:
      "Elys Prime'ın 4 bloğundaki 16 daire tipi: normal kat köşe ve orta tipler, çatı katı ve dubleks planlar. Tüm kat planlarını büyüterek inceleyin.",
    blocks: [
      p("Daire planları, bir projede en çok incelenen ama en az anlatılan içeriktir. Aşağıdaki planları blok blok gruplandırdık; her tipin kendi sayfasında plan görselini tam boyutta görebilir ve o tipin ne sunduğunu okuyabilirsiniz."),
      p("Planlar bilgilendirme amaçlıdır. Net alan, brüt alan ve oda ölçüleri gibi teknik detaylar için satış ekibimizden onaylı proje dosyasını talep edebilirsiniz."),
    ],
    planTypes: {
      "Normal Kat|Köşe Tip": [
        "Köşe tipler, blokların iki cepheye bakan uç noktalarında konumlanır. Bu konum sayesinde salon ve yatak odaları farklı yönlerden ışık alır; gün boyunca dairenin farklı bölümleri aydınlanır ve hava sirkülasyonu belirgin biçimde artar.",
        "İki cepheli olmak aynı zamanda daha fazla pencere anlamına gelir. Mobilya yerleşiminde biraz daha dikkat gerektirse de, açık ve ferah bir iç mekân hissi sunar. Manzara açısından da normal kat tipleri arasında en avantajlı seçenek köşe tiplerdir.",
      ],
      "Normal Kat|Orta Tip": [
        "Orta tipler, blok içinde iki daire arasında konumlanan ve tek cepheden ışık alan planlardır. Bu şema, duvar yüzeylerinin daha bütünlüklü olması sayesinde mobilya yerleşiminde büyük serbestlik sağlar.",
        "Komşu dairelerle paylaşılan duvarlar, orta tiplerde ısı yalıtımı açısından da avantaj yaratır. Gürültü ve mahremiyet konusunda daha korunaklı bir yaşam arayanlar için orta tipler, projedeki en dengeli seçeneklerden biridir.",
      ],
      "Çatı Katı|Köşe Tip": [
        "Çatı katı köşe tipleri, blokların en üst kotunda ve iki cephede konumlanır. Üst komşusu olmayan bu daireler, hem sessizlik hem de manzara açısından projenin en ayrıcalıklı planları arasında yer alır.",
        "Çatı kotundaki bu tipler, normal katlara göre farklı bir tavan ve plan kurgusuna sahiptir. Işık alma süresi gün boyunca en uzun olan daire tipidir.",
      ],
      "Çatı Katı|Orta Tip": [
        "Çatı katı orta tipleri, en üst kotun sakinliğini tek cepheli planın düzenli iç kurgusuyla birleştirir. Üst kat komşusu bulunmaması, günlük yaşamda fark edilir bir sessizlik sağlar.",
        "Manzara ve gün ışığı avantajını, normal kat orta tiplerinin bilinen plan mantığıyla birlikte arayanlar için uygun bir seçenektir.",
      ],
      "Dubleks|Köşe Tip": [
        "Dubleks köşe tipleri, iki katta kurgulanmış ve iki cepheye açılan planlardır. Yaşam alanı ile yatak odalarının farklı katlara ayrılması, kalabalık haneler için günlük düzeni belirgin biçimde kolaylaştırır.",
        "Alt kat genellikle salon, mutfak ve ortak kullanım için; üst kat ise özel alanlar için kurgulanır. İki cepheli olması, her iki katın da bağımsız biçimde ışık almasını sağlar. Projedeki en geniş yaşam alanlarını sunan tiplerdendir.",
      ],
      "Dubleks|Orta Tip": [
        "Dubleks orta tipleri, iki katlı yaşamın konforunu tek cepheli planın düzenli kurgusuyla birleştirir. Katlar arası ayrım, aynı evde farklı ritimlerde yaşayan bireyler için mahremiyet alanı yaratır.",
        "Ev ofis, çalışma odası ya da büyüyen çocuklar için ayrı bir kat arayan aileler, bu tipte aradıkları esnekliği bulur.",
      ],
    },
  },

  konum: {
    slug: "konum",
    label: "Konum ve Ulaşım",
    title: "Konum ve Ulaşım",
    lead: "Elys Prime, Pendik'in gelişen yaşam bölgesinde, toplu taşıma bağlantılarına yürüme mesafesinde konumlanıyor.",
    seoTitle: "Konum ve Ulaşım",
    seoDescription:
      "Elys Prime'ın Pendik'teki konumu: metroya 5 dakika, otobüs durağına 2 dakika yürüme mesafesi, şehir merkezine araçla 6 dakika. Harita ve ulaşım bilgileri.",
    blocks: [
      h("Toplu taşımaya yürüme mesafesi"),
      p("Projenin en belirleyici özelliklerinden biri konumu. Metroya 5 dakika, otobüs durağına 2 dakika yürüme mesafesindeki konum, günlük ulaşımı araca bağımlı olmaktan çıkarıyor. Şehir merkezine ise araçla yaklaşık 6 dakikada ulaşılıyor."),
      p("İstanbul'da konut seçerken ulaşım süresi, dairenin kendisi kadar belirleyicidir. Pendik'in bu bölgesi, hem Anadolu Yakası'nın iş merkezlerine hem de raylı sistem üzerinden şehrin geri kalanına makul sürelerde bağlanıyor."),
      h("Çevredeki yaşam"),
      p("Pendik, son yıllarda İstanbul'un en hızlı dönüşen ilçelerinden biri. Sağlık, eğitim ve alışveriş altyapısı yerleşik durumda; bölgedeki yeni konut projeleri ise çevrenin genel yaşam standardını yukarı çekiyor."),
      p("Elys Prime'ın konumlandığı alan, bu dönüşümün merkezinde yer alıyor. Aşağıdaki harita üzerinden projenin tam konumunu inceleyebilir, çevredeki noktalara olan mesafeleri kendiniz ölçebilirsiniz."),
    ],
  },

  iletisim: {
    slug: "iletisim",
    label: "İletişim",
    title: "İletişim",
    lead: "Güncel ödeme planı ve daire seçenekleri için doğrudan satış ekibimizle görüşebilirsiniz.",
    seoTitle: "İletişim",
    seoDescription:
      "Elys Prime satış ekibiyle iletişime geçin. Ödeme planı ve daire seçenekleri için telefon, WhatsApp ve e-posta bilgileri.",
    blocks: [
      p("Telefonla ulaşamadığınız durumlarda WhatsApp üzerinden yazabilirsiniz; mesajlarınıza mesai saatleri içinde dönüş yapılır. Şantiye ziyareti ve daire gezisi için önceden randevu almanızı öneririz."),
    ],
  },

  /**
   * Blog ve Tanıtımlar liste sayfaları. Gövdeyi yazı listesi oluşturduğu için
   * `blocks` varsayılan olarak boştur; panelden metin eklenirse listenin
   * üstünde giriş metni olarak görünür.
   */
  blog: {
    slug: "blog",
    label: "Blog",
    title: "Blog",
    lead: "Konut alım süreci, Pendik'teki yaşam ve projeden güncel notlar.",
    seoTitle: "Blog",
    seoDescription:
      "Elys Prime blogu: konut alım süreci, peşinat ve taksit hesabı, 2+1 ile 3+1 arasında seçim, Pendik'te ulaşım ve günlük yaşam üzerine rehber yazılar.",
    blocks: [],
  },

  tanitimlar: {
    slug: "tanitimlar",
    label: "Tanıtımlar",
    title: "Tanıtımlar",
    lead: "Elys Prime'ın tanıtım içerikleri ve dijital broşürleri.",
    seoTitle: "Tanıtımlar",
    seoDescription:
      "Elys Prime tanıtım içerikleri ve dijital broşürleri. Proje sunumunu, blok yerleşimini ve daire tiplerini görsellerle inceleyin, broşürü indirin.",
    blocks: [],
  },
};
