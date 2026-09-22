/**
 * Lansman kampanyaları.
 *
 * Tek kaynak: hero kutuları, broşür şeridi, footer menüsü ve /kampanya/[slug]
 * SEO sayfaları hep buradan beslenir. Diziye bir kayıt eklemek yeterli —
 * sitemap ve sayfalar kendiliğinden üretilir. Hero yalnızca ilk üç kampanyayı
 * gösterir; geri kalanı broşür şeridinde ve footer menüsünde yer alır.
 *
 * DİKKAT: Bu dizi yalnızca VARSAYILAN. Panelden bir kez kaydedildikten sonra
 * site Firestore'daki `sections/campaigns` belgesini okur; buraya eklenen yeni
 * bir kampanya yayına kendiliğinden yansımaz. `npm run sync-campaigns` eksik
 * kampanyaları mevcut kayıtlara dokunmadan Firestore'a ekler.
 */

export type Campaign = {
  /** /kampanya/[slug] */
  slug: string;
  /** Hero kutusundaki kısa başlık */
  label: string;
  /** Hero kutusundaki alt satır */
  hint: string;
  /** Sayfa H1'i ve broşür kartı başlığı */
  title: string;
  lead: string;
  seoTitle: string;
  seoDescription: string;
  /** Broşür görseli — public/brosur altında */
  poster: string;
  posterAlt: string;
  /** Kartın üstündeki büyük rakam/etiket */
  badge: string;
  paragraphs: string[];
  highlights: { label: string; value: string }[];
};

export const campaigns: Campaign[] = [
  {
    slug: "lansmana-ozel-30-pesinat",
    label: "Lansmana özel %30 peşinat",
    hint: "Sınırlı süre",
    title: "Lansmana Özel %30 Peşinat",
    lead: "Elys Prime lansman döneminde, daire bedelinin yalnızca %30'unu peşin ödeyerek sözleşmenizi başlatabilirsiniz.",
    seoTitle: "Lansmana Özel %30 Peşinat",
    seoDescription:
      "Elys Prime lansman kampanyası: daire bedelinin %30'u peşin, kalanı 30 aya varan taksitlerle. Sultanbeyli'de 4 blok, 192 daire.",
    poster: "/brosur/pesinat-30.svg",
    posterAlt: "Lansmana özel yüzde 30 peşinat kampanya broşürü",
    badge: "%30",
    paragraphs: [
      "Konut alırken en belirleyici eşik, ilk gün ödenmesi gereken tutardır. Elys Prime lansman döneminde bu eşiği mümkün olduğunca aşağı çektik: daire bedelinin %30'unu peşin ödeyerek sözleşmenizi başlatıyor, kalan tutarı taksitlendiriyorsunuz.",
      "Peşinat oranı sabittir ve daire tipine göre değişmez. Normal kat, çatı katı ve dubleks tiplerinin tamamı kampanya kapsamındadır. Kampanya lansman dönemiyle sınırlıdır; güncel geçerlilik durumunu satış ekibimizden teyit edebilirsiniz.",
      "Peşinat sonrası kalan bakiye için ödeme planı, hanenizin bütçesine göre birlikte kurgulanır. Aylık taksit tutarı ve vade seçenekleri için satış ekibimizle görüşmeniz yeterlidir.",
    ],
    highlights: [
      { label: "Peşinat oranı", value: "%30" },
      { label: "Kapsam", value: "Tüm daire tipleri" },
      { label: "Geçerlilik", value: "Lansman dönemi" },
    ],
  },
  {
    slug: "30-ay-taksit",
    label: "30 ay taksit seçenekleriyle",
    hint: "Esnek ödeme",
    title: "30 Ay Taksit Seçenekleriyle",
    lead: "Peşinat sonrası kalan bakiyeyi 30 aya varan taksitlerle, bütçenize uygun bir planla ödeyin.",
    seoTitle: "30 Ay Taksit Seçenekleri",
    seoDescription:
      "Elys Prime'da peşinat sonrası kalan tutar için 30 aya varan taksit seçenekleri. Esnek ödeme planı ve daire seçenekleri.",
    poster: "/brosur/taksit-30-ay.svg",
    posterAlt: "30 ay taksit seçenekleri kampanya broşürü",
    badge: "30 AY",
    paragraphs: [
      "Peşinatı ödedikten sonra kalan bakiye, 30 aya varan bir vadeye yayılabiliyor. Bu, aylık ödemeyi kira ödemesine yakın bir seviyede tutmayı hedefleyen bir kurgu: ev sahibi olurken yaşam standardınızdan ödün vermek zorunda kalmıyorsunuz.",
      "Taksit planı sabit bir şablon değildir. Peşinat oranını yükselterek vadeyi kısaltabilir, ya da vadeyi uzun tutarak aylık yükü hafifletebilirsiniz. Satış ekibimiz, seçtiğiniz daire tipine göre birkaç alternatif plan çıkarıp karşılaştırmanıza yardımcı olur.",
      "Ara ödeme eklemek isteyen alıcılar için plan içinde belirli aylara denk gelen toplu ödemeler tanımlanabilir. Böylece yıl içindeki nakit akışınıza uygun bir takvim kurulur.",
    ],
    highlights: [
      { label: "Azami vade", value: "30 ay" },
      { label: "Plan", value: "Kişiye özel" },
      { label: "Ara ödeme", value: "Tanımlanabilir" },
    ],
  },
  {
    slug: "vade-farksiz",
    label: "Vade farksız",
    hint: "Ek maliyet yok",
    title: "Vade Farksız Ödeme",
    lead: "Taksitlendirme nedeniyle daire bedeline eklenen bir vade farkı yok. Sözleşmede yazan tutarı ödersiniz.",
    seoTitle: "Vade Farksız Ödeme",
    seoDescription:
      "Elys Prime'da taksitli ödemede vade farkı uygulanmaz. Sözleşmedeki tutar sabittir, gizli maliyet yoktur.",
    poster: "/brosur/vade-farksiz.svg",
    posterAlt: "Vade farksız ödeme kampanya broşürü",
    badge: "0 FARK",
    paragraphs: [
      "Taksitli konut satışlarında en sık karşılaşılan sürpriz, vadeye yayılan ödemenin toplamda peşin fiyatın belirgin biçimde üzerine çıkmasıdır. Elys Prime'da bu uygulanmıyor: taksitlendirme nedeniyle daire bedeline eklenen bir vade farkı yok.",
      "Bu, 30 ay boyunca ödeyeceğiniz toplam tutarın sözleşmede yazan bedel olduğu anlamına gelir. Peşin alan da taksitle alan da aynı daire bedelini öder; fark yalnızca ödemenin zamana yayılmasındadır.",
      "Ödeme planındaki tüm kalemler sözleşmede açıkça yer alır. Sözleşme öncesinde planın tamamını yazılı olarak inceleyebilir, sorularınızı satış ekibimize iletebilirsiniz.",
    ],
    highlights: [
      { label: "Vade farkı", value: "Yok" },
      { label: "Toplam bedel", value: "Sözleşmedeki tutar" },
      { label: "Gizli maliyet", value: "Yok" },
    ],
  },
  {
    slug: "bankasiz-kefilsiz-kurasiz",
    label: "Bankasız, kefilsiz, kurasız",
    hint: "Doğrudan satış",
    title: "Bankasız, Kefilsiz, Kurasız",
    lead: "Daireyi doğrudan bizden alıyorsunuz: banka kredisi şartı, kefil ve kura yok.",
    seoTitle: "Bankasız, Kefilsiz, Kurasız",
    seoDescription:
      "Elys Prime'da daire alımında banka kredisi şartı, kefil ve kura yok. Ödeme planının ayrıntıları için satış ekibimizle görüşebilirsiniz.",
    poster: "/brosur/bankasiz-kefilsiz-kurasiz.svg",
    posterAlt: "Bankasız kefilsiz kurasız kampanya broşürü",
    badge: "0 BANKA",
    paragraphs: [
      "Konut alımında süreci uzatan şey çoğu zaman dairenin kendisi değil, onun etrafındaki başlıklardır: kredi başvurusu, kefil arayışı, kurada sıra beklemek. Elys Prime'da bu üç başlık yok — daireyi doğrudan bizden alıyorsunuz.",
      "Banka kredisi kullanmak bir zorunluluk değil; kullanmak isteyen alıcılar için de bir engel bulunmuyor. Kefil gösterme şartı aranmıyor. Daire seçimi kurayla değil, satışta olan planlar arasından sizin tercihinizle yapılıyor.",
      "Ödeme planının ayrıntıları — peşinat oranı, vade ve taksit tutarı — seçtiğiniz daire tipine göre belirlenir ve sözleşmede yazılı olarak yer alır. Size uygun planı birlikte çıkarmak için satış ekibimizle görüşmeniz yeterlidir.",
    ],
    highlights: [
      { label: "Banka kredisi", value: "Şart değil" },
      { label: "Kefil", value: "İstenmiyor" },
      { label: "Daire seçimi", value: "Kura yok" },
    ],
  },
];

export function findCampaign(slug: string) {
  return campaigns.find((campaign) => campaign.slug === slug);
}

export function campaignUrl(campaign: Pick<Campaign, "slug">) {
  return `/kampanya/${campaign.slug}`;
}
