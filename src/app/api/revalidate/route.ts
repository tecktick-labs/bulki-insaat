import { getAuth } from "firebase-admin/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminApp } from "@/lib/firebase-admin";

const BASE_PATHS = [
  "/",
  "/proje",
  "/proje-durumu",
  "/daire-planlari",
  "/konum",
  "/iletisim",
  "/blog",
  "/tanitimlar",
  "/sitemap.xml",
];

/**
 * Panel kaydettiğinde ISR sayfalarını tazeler.
 * Yalnızca `admin` custom claim'i olan hesaplar çağırabilir.
 */
export async function POST(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const adminApp = await getAdminApp();
  if (!adminApp) {
    return NextResponse.json(
      { error: "Sunucuda Firebase kimlik bilgisi yapılandırılmamış." },
      { status: 503 },
    );
  }

  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token);
    if (decoded.admin !== true) {
      return NextResponse.json({ error: "Bu hesabın yönetici yetkisi yok." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Oturum doğrulanamadı." }, { status: 401 });
  }

  // İstemci ek bir yol bildirebilir (örn. yeni yayımlanan bir yazının kendi sayfası).
  let extraPaths: string[] = [];
  try {
    const body = (await request.json()) as { paths?: unknown };
    if (Array.isArray(body.paths)) {
      extraPaths = body.paths.filter((path): path is string => typeof path === "string" && path.startsWith("/"));
    }
  } catch {
    // Gövdesiz istek de geçerli.
  }

  const paths = [...new Set([...BASE_PATHS, ...extraPaths])];
  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: paths, at: Date.now() });
}
