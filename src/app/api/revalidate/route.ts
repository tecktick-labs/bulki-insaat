import { getAuth } from "firebase-admin/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { adminApp, adminFirestore } from "@/lib/firebase-admin";

const REVALIDATED_PATHS = ["/", "/proje", "/daire-planlari", "/proje-durumu", "/konum", "/iletisim"];

/** Panel kaydettiğinde ISR sayfalarını tazeler. Sadece admins/{uid} kaydı olan kullanıcılar çağırabilir. */
export async function POST(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token);
    const admin = await adminFirestore.collection("admins").doc(decoded.uid).get();

    if (!admin.exists) {
      return NextResponse.json({ error: "Bu hesabın yönetici yetkisi yok." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Oturum doğrulanamadı." }, { status: 401 });
  }

  for (const path of REVALIDATED_PATHS) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: REVALIDATED_PATHS, at: Date.now() });
}
