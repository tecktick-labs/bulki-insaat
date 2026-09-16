/**
 * Footer'daki "Belgelerimiz" alanı.
 *
 * ŞİMDİLİK ÖRNEK VERİ: `file` alanları henüz gerçek PDF'lere işaret etmiyor.
 * Panelden PDF yükleme devreye alındığında bu dizi Firestore'daki
 * `projectData/website` dokümanından okunacak ve `file` alanı Storage
 * download URL'iyle dolacak. O zamana kadar kartlar "yakında" durumunda görünür.
 */

export type ProjectDocument = {
  slug: string;
  title: string;
  description: string;
  /** Storage URL — boşsa kart indirilemez durumda gösterilir. */
  file: string;
};

export const projectDocuments: ProjectDocument[] = [
  {
    slug: "insaat-ruhsati",
    title: "İnşaat Ruhsatı",
    description: "Projenin yapı ruhsatı belgesi",
    file: "",
  },
  {
    slug: "yapi-kullanma-izni",
    title: "Yapı Kullanma İzni",
    description: "İskân (yapı kullanma izin) belgesi",
    file: "",
  },
  {
    slug: "imar-plani",
    title: "İmar Planı",
    description: "Parsele ait uygulama imar planı",
    file: "",
  },
  {
    slug: "tapu-senedi",
    title: "Tapu Senedi",
    description: "Arsaya ait tapu kaydı",
    file: "",
  },
];
