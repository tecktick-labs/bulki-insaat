/**
 * Firestore `undefined` değerini kabul etmez; böyle bir alan gönderildiğinde
 * `setDoc` "Unsupported field value: undefined" hatasıyla tüm kaydı reddeder.
 *
 * Bu, opsiyonel alanı olan kayıtlarda kolayca oluşur: örneğin `PageCopy.planTypes`
 * yalnızca daire-planlari sayfasında doludur, diğer sayfalarda `undefined` değerli
 * bir anahtar olarak nesnede kalır. Panelden kaydetmeden önce bu alanlar ayıklanır.
 *
 * DİKKAT: `serverTimestamp()` gibi FieldValue sentinel'leri ve `Timestamp`
 * örnekleri bu fonksiyondan GEÇİRİLMEMELİDİR — iç yapıları kopyalanırsa bozulur.
 * Çağıranlar bunları temizlikten sonra ekler.
 */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as T;
  }

  // Sade nesneler dışındaki her şey (Date, Timestamp, sentinel, ilkel tipler) olduğu gibi kalır.
  if (!isPlainObject(value)) return value;

  const cleaned: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined) continue;
    cleaned[key] = stripUndefined(item);
  }
  return cleaned as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
