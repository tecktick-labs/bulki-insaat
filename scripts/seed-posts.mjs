/**
 * Blog ve tanıtım içeriklerini Firestore'a yazar.
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=... npm run seed-posts            (yalnızca eksikleri ekler)
 *   GOOGLE_APPLICATION_CREDENTIALS=... npm run seed-posts -- --force (üzerine yazar)
 *
 * İçerikler yayında olarak yazılır; panelden taslağa çekebilir ya da
 * metinleri serbestçe düzenleyebilirsiniz.
 *
 * NOT: Hiçbir metinde fiyat yer almaz. Yalnızca proje verisinden doğrulanabilir
 * bilgiler kullanılmıştır (4 blok, 192 daire, 35.000 m², Sultanbeyli, ulaşım süreleri,
 * 16 daire tipi, lansman kampanyası koşulları).
 */
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { getBuildImage } from "../src/lib/media.ts";

const force = process.argv.includes("--force");

const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!inline && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("Kimlik bilgisi yok. GOOGLE_APPLICATION_CREDENTIALS tanımlayın.");
  process.exit(1);
}

const db = getFirestore(initializeApp(inline ? { credential: cert(JSON.parse(inline)) } : { projectId: "elysprime" }));

const h = (text) => ({ type: "heading", text });
const p = (text) => ({ type: "paragraph", text });
const ul = (items) => ({ type: "list", items });
const cta = (text, href, label) => ({ type: "cta", text, href, label });
const quote = (text) => ({ type: "quote", text });

const posts = [
  {
    id: "blog-daire-tipi-nasil-secilir",
    type: "blog",
    slug: "2-1-mi-3-1-mi-daire-tipi-secimi",
    title: "2+1 mi, 3+1 mi? Daire tipi seçerken gerçekten neye bakmalı",
    excerpt:
      "Oda sayısı tek başına doğru daireyi bulmaya yetmiyor. Köşe ve orta tip farkı, kat seçimi ve hanenizin günlük düzeni, metrekareden daha belirleyici.",
    cover: 5,
    coverAlt: "Elys Prime peyzaj alanları ve blok cepheleri",
    seoTitle: "2+1 mi 3+1 mi? Daire Tipi Seçim Rehberi",
    seoDescription:
      "Konut alırken 2+1 ve 3+1 arasında nasıl seçim yapılır? Köşe ve orta tip farkı, çatı katı ve dubleks seçenekleri, kat seçiminin günlük yaşama etkisi.",
    blocks: [
      p("Konut ararken çoğu kişi aramayı oda sayısıyla başlatır: 2+1 mi, 3+1 mi? Bu makul bir başlangıç ama tek başına yanıltıcı. Aynı projede, aynı oda sayısına sahip iki daire, blok içindeki konumları yüzünden günlük yaşamda birbirinden belirgin biçimde ayrışır."),
      p("Bu yazıda Elys Prime'ın 16 daire tipi üzerinden, seçimi gerçekten belirleyen üç değişkeni ele alıyoruz: oda sayısı, blok içindeki konum ve kat."),
      h("1. Oda sayısı: bugünü değil, beş yıl sonrasını düşünün"),
      p("Oda sayısı kararı genellikle bugünün hane büyüklüğüne göre verilir. Oysa konut, ortalama olarak on yılı aşan bir karardır. Çocuk planı olan bir çift için 2+1, üç yıl sonra dar gelebilir. Evden çalışan biri için fazladan bir oda, kirayla ofis tutmakla ev içinde çalışmak arasındaki farktır."),
      p("Tersi de doğru: kullanılmayan bir oda, ısıtılan, temizlenen ve vergisi ödenen bir alandır. Çocukları evden ayrılmış bir çift için 3+1, konfordan çok yük olabilir."),
      ul([
        "Hanede kaç kişi yaşayacak, önümüzdeki beş yılda bu sayı değişecek mi?",
        "Evden çalışan biri var mı? Çalışma alanı salonla paylaşılabilir mi?",
        "Misafir ağırlama sıklığınız ayrı bir oda gerektiriyor mu?",
        "Depolama ihtiyacınız ne kadar? Balkon ve kiler alanları planda nasıl?",
      ]),
      h("2. Köşe tip mi, orta tip mi? Asıl fark burada"),
      p("Elys Prime'ın dört bloğunun her birinde hem köşe hem orta tip daireler var. Aradaki fark, oda sayısından çok daha fazla hissedilir."),
      p("Köşe tipler blokların uç noktalarında yer alır ve iki farklı cepheden ışık alır. Bu, gün boyunca evin farklı bölümlerinin aydınlanması ve çapraz havalandırma anlamına gelir. Yaz aylarında pencereleri karşılıklı açabilmek, klima kullanımını fark edilir ölçüde azaltır. Buna karşılık pencere sayısının fazlalığı, duvar yüzeylerini böler; mobilya yerleşimi biraz daha planlama ister."),
      p("Orta tipler tek cepheden ışık alır ama duvarları bütünlüklüdür. Dolap, kitaplık ve televizyon duvarı gibi büyük parçaları yerleştirmek belirgin biçimde kolaydır. Komşu dairelerle paylaşılan duvarlar, ısı kaybını azaltır; orta tiplerin ısıtma ve soğutma giderleri genellikle daha düşüktür."),
      quote("Köşe tip ışık ve havalandırma kazandırır, orta tip yalıtım ve plan düzeni. İkisi arasında \"daha iyi\" olan yok; hanenizin günlük ritmine uyan var."),
      h("3. Kat seçimi: çatı katı ve dubleks"),
      p("Elys Prime'da A ve C bloklarda üst kat çatı katı, B ve D bloklarda dubleks olarak kurgulandı. Bu iki tip, projenin en geniş ve en farklı yaşam alanlarını sunuyor."),
      p("Çatı katı dairelerin üst komşusu yoktur. Günlük yaşamda bunun karşılığı, tahmin edilenden daha fazla sessizliktir. Gün ışığı alma süresi de blok içindeki en uzun süredir."),
      p("Dubleks tipler yaşam alanıyla yatak odalarını farklı katlara ayırır. Kalabalık haneler için bu ayrım, günlük düzeni belirgin biçimde kolaylaştırır: alt katta hayat devam ederken üst katta biri çalışabilir ya da dinlenebilir. Ev ofis, çalışma odası veya büyüyen çocuklar için ayrı bir kat arayan aileler genellikle bu tipte karar kılar."),
      h("Peki nasıl karar vereceksiniz?"),
      p("Pratik bir yöntem: hafta içi bir gününüzü saat saat yazın. Kim ne zaman evde, kim nerede çalışıyor, akşam yemeği nerede yeniyor, kim ne zaman uyuyor. Bu tablo, hangi planın size uyduğunu oda sayısından çok daha net söyler."),
      p("Ardından planları bu tabloyla birlikte inceleyin. Elys Prime'ın 16 daire tipinin tamamı ayrı ayrı yayımlanmıştır; her tipin çizimini büyütüp kendi günlük düzeninizi üzerine oturtabilirsiniz."),
      cta("Dört bloktaki 16 daire tipinin tamamını plan çizimleriyle inceleyebilirsiniz.", "/daire-planlari", "Daire planlarını inceleyin"),
    ],
    faq: [
      {
        question: "2+1 daire bir aile için yeterli mi?",
        answer:
          "Üç kişilik bir hane için genellikle yeterlidir. Belirleyici olan oda sayısından çok planın kurgusu: salonun kullanılabilir alanı, odaların birbirine göre konumu ve depolama alanları. Evden çalışan biri varsa ya da yakın zamanda hane büyüyecekse 3+1 daha rahat eder.",
      },
      {
        question: "Köşe daire mi orta daire mi daha iyi?",
        answer:
          "Genel geçer bir cevabı yok. Köşe daireler iki cepheden ışık ve çapraz havalandırma sağlar; gün boyu evde olan ve aydınlığa önem verenler için avantajlıdır. Orta daireler tek cepheden ışık alır ama duvarları bütünlüklü olduğu için mobilya yerleşimi kolaydır ve paylaşılan duvarlar sayesinde ısı yalıtımı daha iyidir.",
      },
      {
        question: "Dubleks daire kimler için uygun?",
        answer:
          "Yaşam alanıyla özel alanları birbirinden ayırmak isteyen kalabalık haneler, evden çalışanlar ve büyüyen çocukları için ayrı bir kat arayan aileler için uygundur. Katlar arası geçiş günlük hayatta bir ek çaba gerektirdiğinden, merdiven kullanımı sorun olan haneler için tercih edilmeyebilir.",
      },
      {
        question: "Elys Prime'da kaç farklı daire tipi var?",
        answer:
          "Dört blokta toplam 16 farklı daire tipi bulunuyor: her blokta normal kat köşe ve orta tipler, ayrıca A ve C bloklarda çatı katı, B ve D bloklarda dubleks tipler yer alıyor.",
      },
    ],
  },

  {
    id: "blog-sultanbeyli-de-yasam",
    type: "blog",
    slug: "sultanbeylide-yasam-ulasim-ve-gunluk-hayat",
    title: "Sultanbeyli'de yaşam: ulaşım, çevre ve günlük hayatın gerçeği",
    excerpt:
      "İstanbul'da konut seçerken kapıdan toplu taşımaya kaç dakikada ulaştığınız, dairenin metrekaresinden daha belirleyicidir. Sultanbeyli'de bu tablo nasıl işliyor?",
    cover: 7,
    coverAlt: "Elys Prime projesinin genel görünümü ve çevre yerleşimi",
    seoTitle: "Sultanbeyli'de Yaşam: Ulaşım, Çevre ve Günlük Hayat",
    seoDescription:
      "Sultanbeyli'de konut almadan önce bilinmesi gerekenler: metro ve otobüs bağlantıları, şehir merkezine mesafe, bölgedeki eğitim ve sağlık altyapısı.",
    blocks: [
      p("İstanbul'da ev seçerken sorulması gereken ilk soru genellikle sorulmaz: sabah kapıdan çıktığınızda toplu taşımaya kaç dakikada ulaşıyorsunuz? Bu tek soru, bir konutun günlük yaşam kalitesi hakkında metrekareden çok daha fazlasını anlatır."),
      p("Günde iki kez, on beş dakikalık bir fark, yılda yaklaşık 130 saat eder. Bu, tam üç haftalık mesai demektir."),
      h("Raylı sisteme yürüme mesafesi ne demek"),
      p("Elys Prime'ın konumlandığı bölgede metroya 5 dakika, otobüs durağına 2 dakika yürüme mesafesi var. Şehir merkezine araçla yaklaşık 6 dakikada ulaşılıyor."),
      p("Bu rakamların pratik karşılığı şu: günlük ulaşım için araca bağımlı olmaktan çıkıyorsunuz. Tek araçlı bir hane, ikinci araç almak zorunda kalmıyor. Ehliyeti olmayan ya da araç kullanmayan hane üyeleri — öğrenciler, yaşlılar — kendi başlarına hareket edebiliyor."),
      p("Trafiğin yoğun olduğu saatlerde raylı sistem, karayoluna göre öngörülebilir bir süre sunar. Toplantıya yetişmek ile geç kalmak arasındaki fark çoğu zaman budur."),
      h("Sultanbeyli son on yılda ne değişti"),
      p("Sultanbeyli, İstanbul'un en hızlı dönüşen ilçelerinden biri. Sağlık, eğitim ve alışveriş altyapısı yerleşik durumda; bölgedeki yeni konut projeleri ise çevrenin genel yaşam standardını yukarı çekiyor."),
      p("Bu dönüşümün konut alıcısı açısından anlamı çift yönlü. Bir yandan bölgedeki hizmet kalitesi artıyor. Öte yandan, gelişimini tamamlamış bölgelere göre giriş eşiği hâlâ daha ulaşılabilir durumda."),
      ul([
        "Anadolu Yakası'ndaki iş merkezlerine raylı sistemle bağlantı",
        "Yerleşik sağlık ve eğitim altyapısı",
        "Sahil şeridi ve yeşil alanlara erişim",
        "Sabiha Gökçen Havalimanı'na yakınlık",
      ]),
      h("Bölge seçerken kendinize sorun"),
      p("Bir bölgeyi yalnızca bugünkü haliyle değerlendirmek eksik kalır. Yatırım açısından da, yaşam açısından da sorulması gereken şu: önümüzdeki beş yılda burada ne yapılacak?"),
      p("Ulaşım yatırımları, yeni okullar, hastaneler ve ticari alanlar bir bölgenin yönünü belirler. Bunlar imar planlarından ve belediye yatırım programlarından takip edilebilir; satış görüşmesinde sorulması gereken sorulardandır."),
      cta("Projenin tam konumunu harita üzerinde inceleyebilir, çevredeki noktalara mesafeleri kendiniz ölçebilirsiniz.", "/konum", "Konum ve ulaşım bilgileri"),
    ],
    faq: [
      {
        question: "Elys Prime metroya ne kadar uzaklıkta?",
        answer: "Metro istasyonuna yaklaşık 5 dakika, otobüs durağına ise 2 dakika yürüme mesafesindedir.",
      },
      {
        question: "Şehir merkezine ulaşım ne kadar sürüyor?",
        answer: "Şehir merkezine araçla yaklaşık 6 dakikada ulaşılmaktadır. Yürüyerek yaklaşık 18 dakikalık bir mesafededir.",
      },
      {
        question: "Sultanbeyli'de yaşamak araç sahibi olmayı gerektirir mi?",
        answer:
          "Elys Prime'ın konumu toplu taşımaya yürüme mesafesinde olduğu için günlük ulaşım araç olmadan da mümkündür. Raylı sistem bağlantısı, özellikle trafiğin yoğun olduğu saatlerde öngörülebilir bir ulaşım süresi sağlar.",
      },
    ],
  },

  {
    id: "blog-insaat-asamasinda-konut",
    type: "blog",
    slug: "insaat-asamasindaki-projeden-daire-almak",
    title: "İnşaat aşamasındaki projeden daire almak: sorulması gereken 8 soru",
    excerpt:
      "Proje aşamasında daire almak avantajlı olabilir, ama gördüğünüz şey bir daire değil bir vaattir. Vaadin arkasındaki verilere nasıl bakılır?",
    cover: 9,
    coverAlt: "Elys Prime projesinin akşam saatlerindeki görünümü",
    seoTitle: "İnşaat Aşamasındaki Projeden Daire Almak: 8 Kritik Soru",
    seoDescription:
      "Maketten konut alırken nelere dikkat edilmeli? Tamamlanma oranı, ruhsat ve imar belgeleri, blok bazlı ilerleme, sözleşme ve şantiye ziyareti rehberi.",
    blocks: [
      p("Tamamlanmamış bir projeden daire almak, hazır konut almaktan farklı bir karar sürecidir. Gördüğünüz şey bir daire değil, bir vaattir. Bu yüzden değerlendirme, dairenin kendisinden çok vaadin arkasındaki verilere bakmakla yapılır."),
      p("Aşağıdaki sekiz soru, satış görüşmesinde sorulduğunda hem sizi doğru bilgilendirir hem de karşınızdaki firmanın şeffaflığı hakkında fikir verir."),
      h("1. Projenin güncel tamamlanma oranı nedir?"),
      p("Tamamlanma oranı, bir projenin en çok merak edilen ama en muğlak paylaşılan verisidir. Önemli olan yüzdenin kendisi değil, nasıl ölçüldüğüdür. Kaba inşaat mı, ince işler dahil mi, altyapı ve peyzaj sayılıyor mu?"),
      h("2. Blok bazlı ilerleme paylaşılıyor mu?"),
      p("Dört bloklu bir projede blokların aynı hızda ilerlemesi beklenmez. Almayı düşündüğünüz bloğun kendi durumu, projenin genel ortalamasından daha anlamlıdır."),
      h("3. Onaylı proje dosyası incelemeye açık mı?"),
      p("Yapı ruhsatı, imar planı ve tapu kaydı gibi belgeler talep edildiğinde gösterilmelidir. Bu belgeleri paylaşmakta isteksizlik, tek başına yeterli bir uyarı işaretidir."),
      h("4. Net ve brüt alanlar yazılı olarak veriliyor mu?"),
      p("Tanıtımlarda geçen metrekare çoğunlukla brüt alandır. Fiilen kullanacağınız alan net alandır ve aradaki fark daire tipine göre değişir. Bu iki rakamı da yazılı olarak isteyin."),
      h("5. Daire tipi ve oda sayısı dağılımı nasıl?"),
      p("Aynı projede farklı plan tipleri bulunur. Hangi blokta hangi tiplerin olduğunu, kaçının satıldığını ve size uygun tipten kaç adet kaldığını sorun."),
      h("6. Ödeme planının tüm kalemleri sözleşmede yer alıyor mu?"),
      p("Peşinat oranı, taksit sayısı, ara ödemeler ve varsa vade farkı sözleşmede açıkça yazmalıdır. Sözlü olarak söylenip sözleşmeye girmeyen hiçbir koşula güvenilmemelidir."),
      h("7. Teslim koşulları ve gecikme durumu nasıl düzenlenmiş?"),
      p("Sözleşmede teslim tarihi ve gecikme halinde ne olacağı yazılı olmalıdır. Bu madde, alıcı açısından sözleşmenin en önemli maddelerinden biridir."),
      h("8. Şantiye ziyareti mümkün mü?"),
      p("Yerinde görmek, en çok bilgi veren adımdır. Şantiyeyi gezdirmekten kaçınılmayan bir proje, genellikle gösterecek bir şeyi olan projedir."),
      quote("Bir yapı firmasının inşaat durumunu düzenli ve açık biçimde paylaşması, kendi başına anlamlı bir güven göstergesidir."),
      cta("Elys Prime'ın güncel tamamlanma oranını, blok bazlı daire durumunu ve şantiyeden görselleri yayımlıyoruz.", "/proje", "Proje künyesini inceleyin"),
    ],
    faq: [
      {
        question: "Maketten daire almak riskli mi?",
        answer:
          "Her konut alımı gibi belirli riskler taşır, ancak bu riskler doğru sorularla azaltılabilir. Onaylı proje dosyasının incelenmesi, blok bazlı ilerlemenin takibi, sözleşmedeki teslim ve gecikme maddelerinin dikkatle okunması ve şantiye ziyareti, riski belirgin biçimde düşürür.",
      },
      {
        question: "İnşaat halindeki projede tamamlanma oranı nasıl doğrulanır?",
        answer:
          "Oranın nasıl hesaplandığını sorun: kaba inşaat mı, ince işler ve altyapı dahil mi? Ardından şantiyeyi yerinde ziyaret edip paylaşılan oranla gördüğünüzü karşılaştırın. Düzenli olarak güncellenen ve tarihli görsellerle desteklenen bilgi daha güvenilirdir.",
      },
      {
        question: "Sözleşmede mutlaka bulunması gereken maddeler neler?",
        answer:
          "Daire bedelinin tamamı ve ödeme takvimi, varsa vade farkı, teslim tarihi, gecikme halinde uygulanacak koşullar, net ve brüt alan bilgileri ile teslim edilecek malzeme ve donanım listesi sözleşmede açıkça yer almalıdır.",
      },
    ],
  },

  {
    id: "blog-odeme-plani",
    type: "blog",
    slug: "konut-odeme-plani-pesinat-ve-taksit",
    title: "Peşinat, taksit ve vade farkı: konut ödeme planı nasıl kurgulanır",
    excerpt:
      "Konut alımında ilk gün ödenecek tutar kadar, sonraki otuz ayın nasıl planlandığı da belirleyicidir. Ödeme planını okumanın pratik yolu.",
    cover: 2,
    coverAlt: "Elys Prime sosyal yaşam alanları ve avlular",
    seoTitle: "Konut Ödeme Planı: Peşinat, Taksit ve Vade Farkı",
    seoDescription:
      "Konut alırken peşinat oranı, taksit vadesi ve vade farkı nasıl değerlendirilir? Ödeme planını okumanın ve karşılaştırmanın pratik yolu.",
    blocks: [
      p("Konut alım kararı çoğu zaman tek bir sayıya indirgenir: peşinat. Oysa ilk gün ödenen tutar kadar, sonraki aylara yayılan planın nasıl kurgulandığı da belirleyicidir. İki farklı plan, aynı daire için bütünüyle farklı bir yük anlamına gelebilir."),
      h("Peşinat: giriş eşiği"),
      p("Peşinat, konut alımındaki ilk ve en belirgin eşiktir. Oranın düşük olması girişi kolaylaştırır; yüksek olması ise kalan bakiyeyi ve dolayısıyla aylık yükü azaltır."),
      p("Elys Prime lansman döneminde peşinat oranı daire bedelinin %30'u olarak belirlendi ve daire tipine göre değişmiyor. Normal kat, çatı katı ve dubleks tiplerinin tamamı aynı kapsamda."),
      h("Vade: aylık yük ile toplam süre arasındaki denge"),
      p("Peşinat sonrası kalan bakiye vadeye yayılır. Vadeyi uzatmak aylık ödemeyi hafifletir; kısaltmak ise borcu daha erken bitirir. Burada doğru cevap bütçenizin yapısına bağlıdır."),
      p("Elys Prime'da kalan bakiye 30 aya varan bir vadeye yayılabiliyor. Plan sabit bir şablon değil: peşinatı yükselterek vadeyi kısaltabilir ya da vadeyi uzun tutarak aylık yükü azaltabilirsiniz."),
      h("Vade farkı: en çok gözden kaçan kalem"),
      p("Taksitli konut satışlarında en sık karşılaşılan sürpriz, vadeye yayılan ödemenin toplamda peşin bedelin belirgin biçimde üzerine çıkmasıdır. Bu fark her zaman açıkça ifade edilmez; toplam tutar hesaplandığında ortaya çıkar."),
      p("Bir ödeme planını değerlendirirken yapılacak en basit kontrol şudur: taksit tutarını taksit sayısıyla çarpın, peşinatı ekleyin ve çıkan toplamı daire bedeliyle karşılaştırın. Aradaki fark, vade farkıdır."),
      p("Elys Prime'da taksitlendirme nedeniyle daire bedeline eklenen bir vade farkı bulunmuyor; 30 ay boyunca ödenen toplam tutar sözleşmede yazan bedeldir."),
      h("Ara ödemeler: nakit akışına uygun takvim"),
      p("Bazı alıcılar için yılın belirli aylarında toplu ödeme yapmak, aylık taksiti düşük tutmaktan daha uygundur. İkramiye, kira geliri ya da mevsimlik gelir gibi kalemler bu şekilde plana dahil edilebilir."),
      ul([
        "Peşinat oranı ve tutarı",
        "Taksit sayısı ve aylık tutar",
        "Varsa vade farkı ve toplam ödenecek bedel",
        "Ara ödeme tarihleri ve tutarları",
        "Gecikme halinde uygulanacak koşullar",
      ]),
      p("Bu beş kalemin tamamı sözleşmede yazılı olmalıdır. Sözleşme öncesinde planın tümünü yazılı olarak inceleyip sorularınızı iletmeniz, sonradan yaşanabilecek anlaşmazlıkların büyük bölümünü ortadan kaldırır."),
      cta("Lansman dönemine özel peşinat ve taksit koşullarının ayrıntılarını inceleyebilirsiniz.", "/kampanya/lansmana-ozel-30-pesinat", "Kampanya koşullarını görün"),
    ],
    faq: [
      {
        question: "Elys Prime'da peşinat oranı nedir?",
        answer:
          "Lansman döneminde peşinat oranı daire bedelinin %30'udur ve daire tipine göre değişmez. Kampanya lansman dönemiyle sınırlıdır; güncel geçerlilik durumu satış ekibinden teyit edilmelidir.",
      },
      {
        question: "Kaç ay taksit yapılabiliyor?",
        answer:
          "Peşinat sonrası kalan bakiye 30 aya varan bir vadeye yayılabilmektedir. Plan kişiye özel kurgulanır; peşinat oranı yükseltilerek vade kısaltılabilir ya da vade uzatılarak aylık ödeme hafifletilebilir.",
      },
      {
        question: "Taksitli alımda vade farkı uygulanıyor mu?",
        answer:
          "Hayır. Taksitlendirme nedeniyle daire bedeline eklenen bir vade farkı bulunmamaktadır. 30 ay boyunca ödenecek toplam tutar sözleşmede yazan bedeldir; peşin alan da taksitle alan da aynı daire bedelini öder.",
      },
      {
        question: "Ödeme planına ara ödeme eklenebilir mi?",
        answer:
          "Evet. Plan içinde belirli aylara denk gelen toplu ödemeler tanımlanabilir. Böylece yıl içindeki nakit akışınıza uygun bir takvim kurulabilir.",
      },
    ],
  },

  {
    id: "tanitim-elys-prime-genel",
    type: "tanitim",
    slug: "elys-prime-proje-tanitimi",
    title: "Elys Prime: Sultanbeyli'de 4 blok, 192 daire, 35.000 m² yaşam alanı",
    excerpt:
      "Bülki Yapı ve Çözüm Konut ortaklığıyla Sultanbeyli'de yükselen Elys Prime'ın blok kurgusu, daire çeşitliliği, sosyal alanları ve konumu.",
    cover: 3,
    coverAlt: "Elys Prime mimarisi: modern çizgiler ve sıcak malzeme dokuları",
    seoTitle: "Elys Prime Proje Tanıtımı — Sultanbeyli Konut Projesi",
    seoDescription:
      "Elys Prime tanıtımı: Sultanbeyli'de 4 blok, 192 daire, 35.000 m² inşaat alanı, 16 daire tipi, iç bahçeler ve toplu taşımaya yürüme mesafesinde konum.",
    blocks: [
      p("Elys Prime, Bülki Yapı ve Çözüm Konut ortaklığıyla Sultanbeyli'de yükselen, dört bloktan ve 192 daireden oluşan bir yaşam projesidir. Toplam 35.000 m² inşaat alanına yayılan proje, modern mimariyi geniş peyzaj alanları ve sosyal yaşam kurgusuyla bir araya getirir."),
      h("Projeyi tanımlayan başlıklar"),
      ul([
        "4 blok, blok başına 48 daire, toplam 192 daire",
        "35.000 m² inşaat alanı",
        "16 farklı daire tipi: normal kat köşe ve orta, çatı katı, dubleks",
        "İç bahçeler, avlular, spor ve çocuk oyun alanları",
        "Metroya 5 dakika, otobüs durağına 2 dakika yürüme mesafesi",
        "Şehir merkezine araçla yaklaşık 6 dakika",
      ]),
      h("Yerleşim kurgusu"),
      p("A, B, C ve D bloklarının her biri 48 daire barındırıyor. Bloklar birbirinden kopuk kütleler olarak değil, ortak avlular ve peyzaj alanları üzerinden birbirine bağlanan bir yerleşim olarak kurgulandı. Böylece her daire hem kendi mahremiyetini koruyor hem de ortak yaşam alanlarına doğrudan açılıyor."),
      p("Blokların konumlanışı, dairelerin büyük bölümünün gün ışığından mümkün olduğunca uzun süre faydalanmasını gözetiyor. Köşe tipler iki cepheden ışık alırken, orta tipler daha derin ve korunaklı bir plan şemasına sahip."),
      h("Daire tipleri"),
      p("Her blokta normal kat köşe ve orta tipler bulunuyor. Üst katlar ise bloğa göre farklılaşıyor: A ve C bloklarda çatı katı, B ve D bloklarda dubleks olarak tasarlandı. Bu dağılım, aynı proje içinde birbirinden belirgin biçimde farklı yaşam alanları sunuyor."),
      p("Çatı katı daireler üst komşusu olmayan, gün ışığını en uzun süre alan tiplerdir. Dubleks tipler ise yaşam alanı ile yatak odalarını farklı katlara ayırarak kalabalık haneler için günlük düzeni kolaylaştırır."),
      cta("16 daire tipinin tamamını plan çizimleriyle inceleyebilirsiniz.", "/daire-planlari", "Daire planlarını görün"),
      h("Mimari yaklaşım"),
      p("Projenin mimari dili, modern ve sade çizgileri sıcak malzeme dokularıyla bir araya getiriyor. Cephede kullanılan yatay ve düşey ritim, blokların kütlesel ağırlığını kırarak insan ölçeğine yakın bir siluet oluşturuyor. Gündüz sakin ve nötr duran cepheler, akşam aydınlatmasıyla birlikte farklı bir atmosfere bürünüyor."),
      h("Sosyal alanlar ve peyzaj"),
      p("İç bahçeler ve avlular projenin omurgasını oluşturuyor. Peyzaj, bloklar arasındaki boşlukları dolduran bir süs unsuru olarak değil, günlük yaşamın içinden geçtiği bir zemin olarak tasarlandı. Spor alanları, çocuk oyun alanları ve yürüyüş aksları bu zeminin üzerine yerleşiyor."),
      h("Konum"),
      p("Elys Prime, Sultanbeyli Akşemsettin Mahallesi'nde, toplu taşıma bağlantılarına yürüme mesafesinde konumlanıyor. Metroya 5 dakika, otobüs durağına 2 dakika yürüme mesafesindeki konum, günlük ulaşımı araca bağımlı olmaktan çıkarıyor."),
      cta("Projenin tam konumunu harita üzerinde inceleyebilirsiniz.", "/konum", "Konum ve ulaşım"),
      p("Bu tanıtım bilgilendirme amaçlıdır. Onaylı proje dosyası, net ve brüt alan bilgileri ile güncel ödeme koşulları için satış ekibimizle iletişime geçebilirsiniz."),
    ],
    faq: [
      {
        question: "Elys Prime nerede yer alıyor?",
        answer:
          "Proje, İstanbul Sultanbeyli Akşemsettin Mahallesi'nde yer almaktadır. Metro istasyonuna yaklaşık 5 dakika, otobüs durağına 2 dakika yürüme mesafesindedir; şehir merkezine araçla yaklaşık 6 dakikada ulaşılır.",
      },
      {
        question: "Projede kaç daire var?",
        answer:
          "Dört blokta toplam 192 daire bulunmaktadır. Her blok 48 daire barındırır ve proje 35.000 m² inşaat alanına yayılmaktadır.",
      },
      {
        question: "Hangi daire tipleri mevcut?",
        answer:
          "Toplam 16 farklı daire tipi bulunuyor. Her blokta normal kat köşe ve orta tipler yer alırken, A ve C bloklarda çatı katı, B ve D bloklarda dubleks tipler tasarlandı.",
      },
      {
        question: "Projede hangi sosyal alanlar var?",
        answer:
          "İç bahçeler, avlular, spor alanları, çocuk oyun alanları ve yürüyüş aksları bulunmaktadır. Peyzaj, bloklar arasındaki alanları günlük yaşamın içinden geçtiği bir zemin olarak kurgular.",
      },
      {
        question: "Ödeme koşulları nasıl?",
        answer:
          "Lansman döneminde peşinat oranı daire bedelinin %30'u olup, kalan bakiye 30 aya varan vadeyle ödenebilmektedir. Taksitlendirme nedeniyle vade farkı uygulanmaz. Güncel koşullar için satış ekibiyle görüşülmesi önerilir.",
      },
    ],
  },
];

let written = 0;
let skipped = 0;

for (const post of posts) {
  const ref = db.collection("posts").doc(post.id);

  if (!force && (await ref.get()).exists) {
    console.log(`- posts/${post.id} zaten var, atlandı (--force ile üzerine yazılır)`);
    skipped += 1;
    continue;
  }

  const { cover, ...rest } = post;
  await ref.set({
    ...rest,
    coverImage: getBuildImage(cover),
    published: true,
    publishedAt: Timestamp.now(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const words = post.blocks.flatMap((b) => [b.text ?? "", ...(b.items ?? [])]).join(" ").split(/\s+/).filter(Boolean).length;
  console.log(`✓ ${post.type.padEnd(8)} /${post.type === "blog" ? "blog" : "tanitimlar"}/${post.slug}  (~${words} kelime, ${post.faq.length} SSS)`);
  written += 1;
}

console.log(`\n${written} içerik yazıldı, ${skipped} atlandı. Hepsi YAYINDA.`);
