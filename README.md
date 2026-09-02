# Elys Prime — Bulki Yapı

Elys Prime projesini ve daire seçeneklerini sunan React tabanlı web sitesi.

## Teknolojiler

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Firebase Hosting + Firestore

## Yerel geliştirme

```bash
npm install
npm run dev
```

Yönetim paneli yerelde `/panel` adresindedir. Panel ortak giriş kodu ilk başarılı girişte
Firestore'daki `projectData/panel-access` belgesine hash olarak kaydedilir. Site içeriği
`projectData/website` belgesinde tutulur ve açık sayfalarda gerçek zamanlı güncellenir.

## Derleme ve yayınlama

```bash
npm run build
firebase deploy --only hosting,firestore:rules
```

Vite çıktısı `dist/` klasörüne oluşturulur. `firebase.json`, ana sayfa ve `/panel` dahil tüm istemci rotalarını `index.html` dosyasına yönlendirir.

> Firebase Auth kullanılmadığı için panel giriş ekranı istemci taraflı bir erişim kapısıdır.
> Firestore'a doğrudan yazma yetkisini kullanıcı bazında doğrulamaz. Gerçek yönetici
> güvenliği gerektiğinde Firebase Auth ve kimliğe bağlı Firestore Rules kullanılmalıdır.
