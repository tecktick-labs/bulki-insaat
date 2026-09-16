/**
 * Alt sayfaların gövde metinleri. SEO'nun asıl belirleyicisi burası —
 * metinleri dilediğiniz gibi düzenleyebilirsiniz, kod değişikliği gerekmez.
 *
 * NOT: Fiyat, teslim tarihi ve daire m² bilgileri elimizde olmadığı için
 * bilinçli olarak yazılmadı. Bu veriler netleştiğinde buraya eklenmeli —
 * "Pendik 3+1 daire fiyatları" gibi aramalar için en değerli içerik onlar.
 */

export const projePage = {
  title: "Proje Hakkında",
  lead:
    "Elys Prime, Bulki Yapı güvencesiyle Pendik'te yükselen, dört bloktan ve 192 daireden oluşan bütüncül bir yaşam projesidir.",
  body: [
    {
      heading: "Dört blok, tek bir yaşam kurgusu",
      paragraphs: [
        "Elys Prime; A, B, C ve D olmak üzere dört bloktan oluşuyor ve her blok 48 daire barındırıyor. Toplam 35.000 m² inşaat alanına yayılan proje, blokları birbirinden koparan değil, ortak avlular ve peyzaj alanları üzerinden birbirine bağlayan bir yerleşim kurgusuna sahip. Böylece her daire hem kendi mahremiyetini koruyor hem de ortak yaşam alanlarına doğrudan açılıyor.",
        "Blokların konumlanışı, dairelerin büyük bölümünün gün ışığından mümkün olduğunca uzun süre faydalanmasını gözetiyor. Köşe tipler iki cepheden ışık alırken, orta tipler daha derin ve korunaklı bir plan şemasına sahip. Çatı katı ve dubleks tipleri ise projenin en geniş yaşam alanlarını sunuyor.",
      ],
    },
    {
      heading: "Mimari yaklaşım",
      paragraphs: [
        "Projenin mimari dili, modern ve sade çizgileri sıcak malzeme dokularıyla bir araya getiriyor. Cephede kullanılan yatay ve düşey ritim, blokların kütlesel ağırlığını kırarak insan ölçeğine yakın bir siluet oluşturuyor. Gündüz sakin ve nötr duran cepheler, akşam aydınlatmasıyla birlikte tamamen farklı bir atmosfere bürünüyor.",
        "İç bahçeler ve avlular projenin omurgasını oluşturuyor. Peyzaj, blokların arasındaki boşlukları dolduran bir süs unsuru olarak değil, günlük yaşamın içinden geçtiği bir zemin olarak tasarlandı. Spor alanları, çocuk oyun alanları ve yürüyüş aksları bu zeminin üzerine yerleşiyor.",
      ],
    },
    {
      heading: "Kimler için",
      paragraphs: [
        "Elys Prime, ilk evini alan çiftlerden çocuklu ailelere, yatırım amaçlı konut arayanlardan Pendik'te iş yaşamına yakın olmak isteyenlere kadar geniş bir kitleye hitap ediyor. Normal kat, çatı katı ve dubleks tipleriyle farklı hane büyüklüklerine yanıt veren bir daire çeşitliliği sunuyor.",
        "Ulaşılabilir ödeme seçenekleri, projenin başından beri önceliklendirdiği konulardan biri. Güncel ödeme planı ve daire seçenekleri için satış ekibiyle doğrudan iletişime geçebilirsiniz.",
      ],
    },
  ],
};

export const durumPage = {
  title: "Proje Durumu",
  lead:
    "İnşaatın güncel ilerlemesini, blok bazlı daire durumunu ve şantiyeden güncel görselleri bu sayfadan takip edebilirsiniz.",
  body: [
    {
      heading: "Şeffaf ilerleme takibi",
      paragraphs: [
        "Konut alırken en çok merak edilen soru, projenin gerçekte hangi aşamada olduğudur. Elys Prime'da bu bilgiyi gizlemek yerine düzenli olarak güncelliyoruz: aşağıdaki tamamlanma oranı, satılan daire sayısı ve blok bazlı doluluk verileri doğrudan satış ekibimizin tuttuğu kayıtlardan geliyor.",
        "Blok kartlarındaki satış oranı, o bloktaki toplam daire sayısına göre hesaplanır. Kalan daire sayısı gerçek zamanlı değildir; bir daire için görüşme sürecindeyseniz güncel durumu satış ekibimizden teyit etmenizi öneririz.",
      ],
    },
    {
      heading: "Daire tipi dağılımı",
      paragraphs: [
        "Her blokta normal kat köşe tipleri, normal kat orta tipleri ve çatı katı ya da dubleks olarak kurgulanan özel tipler bulunuyor. A ve C bloklarda üst kat çatı katı olarak, B ve D bloklarda ise dubleks olarak tasarlandı. Bu dağılım, aynı proje içinde birbirinden belirgin biçimde farklı yaşam alanları sunuyor.",
      ],
    },
  ],
};

export const planlarPage = {
  title: "Daire Planları",
  lead:
    "Elys Prime'da dört blok ve 16 farklı daire tipi bulunuyor. Her planı büyütüp inceleyebilir, kendi yaşam düzeninize uyanı seçebilirsiniz.",
  intro: [
    "Daire planları, bir projede en çok incelenen ama en az anlatılan içeriktir. Aşağıdaki planları blok blok gruplandırdık; her tipin kendi sayfasında plan görselini tam boyutta görebilir ve o tipin ne sunduğunu okuyabilirsiniz.",
    "Planlar bilgilendirme amaçlıdır. Net alan, brüt alan ve oda ölçüleri gibi teknik detaylar için satış ekibimizden onaylı proje dosyasını talep edebilirsiniz.",
  ],
};

/** Daire tipi ailelerine göre açıklama metinleri. */
export const planDescriptions: Record<string, string[]> = {
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
};

export const konumPage = {
  title: "Konum ve Ulaşım",
  lead:
    "Elys Prime, Pendik'in gelişen yaşam bölgesinde, toplu taşıma bağlantılarına yürüme mesafesinde konumlanıyor.",
  body: [
    {
      heading: "Toplu taşımaya yürüme mesafesi",
      paragraphs: [
        "Projenin en belirleyici özelliklerinden biri konumu. Metroya 5 dakika, otobüs durağına 2 dakika yürüme mesafesindeki konum, günlük ulaşımı araca bağımlı olmaktan çıkarıyor. Şehir merkezine ise araçla yaklaşık 6 dakikada ulaşılıyor.",
        "İstanbul'da konut seçerken ulaşım süresi, dairenin kendisi kadar belirleyicidir. Pendik'in bu bölgesi, hem Anadolu Yakası'nın iş merkezlerine hem de raylı sistem üzerinden şehrin geri kalanına makul sürelerde bağlanıyor.",
      ],
    },
    {
      heading: "Çevredeki yaşam",
      paragraphs: [
        "Pendik, son yıllarda İstanbul'un en hızlı dönüşen ilçelerinden biri. Sağlık, eğitim ve alışveriş altyapısı yerleşik durumda; bölgedeki yeni konut projeleri ise çevrenin genel yaşam standardını yukarı çekiyor.",
        "Elys Prime'ın konumlandığı alan, bu dönüşümün merkezinde yer alıyor. Aşağıdaki harita üzerinden projenin tam konumunu inceleyebilir, çevredeki noktalara olan mesafeleri kendiniz ölçebilirsiniz.",
      ],
    },
  ],
};

export const iletisimPage = {
  title: "İletişim",
  lead:
    "Güncel fiyatlar, ödeme planı ve daire seçenekleri için doğrudan satış ekibimizle görüşebilirsiniz.",
  note:
    "Telefonla ulaşamadığınız durumlarda WhatsApp üzerinden yazabilirsiniz; mesajlarınıza mesai saatleri içinde dönüş yapılır. Şantiye ziyareti ve daire gezisi için önceden randevu almanızı öneririz.",
};
