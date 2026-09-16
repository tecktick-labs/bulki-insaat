/**
 * Panel yetkisi verir/alır. Yetki Firebase Auth custom claim'i olarak saklanır ve
 * hem Firestore hem Storage kurallarında kullanılır.
 *
 * Kullanım:
 *   GOOGLE_APPLICATION_CREDENTIALS=/yol/servis-hesabi.json node scripts/set-admin.mjs eposta@ornek.com [...]
 *   ... node scripts/set-admin.mjs --revoke eposta@ornek.com
 *
 * Kullanıcının Firebase Authentication'da önceden oluşturulmuş olması gerekir
 * (Console → Authentication → Users → Add user).
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const args = process.argv.slice(2);
const revoke = args.includes("--revoke");
const emails = args.filter((arg) => !arg.startsWith("--"));

if (emails.length === 0) {
  console.error("Kullanım: node scripts/set-admin.mjs [--revoke] eposta@ornek.com [...]");
  process.exit(1);
}

const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!inline && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("Kimlik bilgisi yok. GOOGLE_APPLICATION_CREDENTIALS ya da FIREBASE_SERVICE_ACCOUNT_JSON tanımlayın.");
  process.exit(1);
}

const app = initializeApp(inline ? { credential: cert(JSON.parse(inline)) } : {});
const auth = getAuth(app);

for (const email of emails) {
  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, revoke ? {} : { admin: true });
    console.log(`${revoke ? "✗ yetki alındı" : "✓ yönetici"}: ${email} (${user.uid})`);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      console.error(`✗ ${email} bulunamadı. Önce Firebase Console → Authentication → Users bölümünden ekleyin.`);
    } else {
      console.error(`✗ ${email}: ${error.message}`);
    }
  }
}

console.log("\nNot: Yetki değişikliğinin geçerli olması için kullanıcının panelden çıkıp tekrar girmesi gerekir.");
