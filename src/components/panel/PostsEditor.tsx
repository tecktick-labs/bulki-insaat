"use client";
import { ArrowLeft, Check, ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deletePost, fetchAllPosts, revalidateSite, savePost } from "@/lib/content.client";
import {
  emptyPost,
  postTypeLabels,
  postUrl,
  slugify,
  type Post,
  type PostType,
} from "@/lib/content-types";
import BlockEditor from "./BlockEditor";
import ImageField from "./ImageField";
import { buttonClass, inputClass, labelClass, primaryButtonClass } from "./ui";

function newPost(type: PostType): Post {
  return { id: `${type}-${Date.now()}`, ...emptyPost(type) };
}

export default function PostsEditor() {
  // null = henüz yüklenmedi. Ayrı bir isLoading state'ine gerek kalmıyor.
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [draft, setDraft] = useState<Post | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const isLoading = posts === null;
  const load = () => setReloadKey((current) => current + 1);

  useEffect(() => {
    let cancelled = false;

    fetchAllPosts()
      .then((next) => {
        if (cancelled) return;
        setPosts(next);
        setError("");
      })
      .catch(() => {
        if (cancelled) return;
        setPosts([]);
        setError("İçerikler okunamadı. Firestore bağlantısını ve yetkinizi kontrol edin.");
      });

    return () => { cancelled = true; };
  }, [reloadKey]);

  const set = <K extends keyof Post>(key: K, value: Post[K]) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));

  const save = async () => {
    if (!draft) return;

    const slug = draft.slug.trim() || slugify(draft.title);
    if (!slug || !draft.title.trim()) {
      setError("Başlık zorunludur; URL adresi başlıktan üretilir.");
      return;
    }

    const duplicate = (posts ?? []).some((post) => post.id !== draft.id && post.type === draft.type && post.slug === slug);
    if (duplicate) {
      setError("Bu URL adresi aynı tipte başka bir içerikte kullanılıyor.");
      return;
    }

    const normalized: Post = { ...draft, slug, updatedAt: new Date().toISOString() };
    setIsSaving(true);
    setError("");
    try {
      await savePost(normalized);
      await revalidateSite([postUrl(normalized)]);
      setDraft(normalized);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
      load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "İçerik kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (post: Post) => {
    if (!window.confirm(`"${post.title}" kalıcı olarak silinsin mi?`)) return;
    try {
      await deletePost(post.id);
      await revalidateSite([postUrl(post)]);
      if (draft?.id === post.id) setDraft(null);
      load();
    } catch {
      setError("İçerik silinemedi.");
    }
  };

  if (isLoading) {
    return <p className="flex items-center gap-2 py-10 text-sm text-white/45"><Loader2 size={15} className="animate-spin" /> Yükleniyor...</p>;
  }

  if (draft) {
    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setDraft(null)} className={buttonClass}>
            <ArrowLeft size={14} /> Listeye dön
          </button>
          <div className="flex flex-wrap gap-2">
            {draft.slug && draft.published && (
              <a href={postUrl(draft)} target="_blank" rel="noreferrer" className={buttonClass}>
                <ExternalLink size={14} /> Sayfayı aç
              </a>
            )}
            <button type="button" disabled={isSaving} onClick={save} className={primaryButtonClass}>
              {saved ? <Check size={14} /> : <Save size={14} />} {isSaving ? "Kaydediliyor..." : saved ? "Kaydedildi" : "Kaydet"}
            </button>
          </div>
        </div>

        {error && <p role="alert" className="mb-5 border border-red-300/25 bg-red-300/10 px-5 py-4 text-sm text-red-200">{error}</p>}

        <section className="border border-white/10 bg-[#202320] p-5 sm:p-7">
          <h3 className="mb-5 text-xl font-semibold">Temel bilgiler</h3>
          <div className="grid gap-5 lg:grid-cols-2">
            <label className={labelClass}>
              İçerik tipi
              <select className={inputClass} value={draft.type} onChange={(event) => set("type", event.target.value as PostType)}>
                {(Object.keys(postTypeLabels) as PostType[]).map((type) => (
                  <option key={type} value={type}>{postTypeLabels[type]}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Yayın durumu
              <select className={inputClass} value={draft.published ? "1" : "0"} onChange={(event) => set("published", event.target.value === "1")}>
                <option value="0">Taslak (sitede görünmez)</option>
                <option value="1">Yayında</option>
              </select>
            </label>

            <label className={labelClass}>
              Başlık
              <input
                className={inputClass}
                value={draft.title}
                onChange={(event) => {
                  const title = event.target.value;
                  setDraft((current) =>
                    current ? { ...current, title, slug: current.slug || slugify(title) } : current,
                  );
                }}
              />
            </label>

            <label className={labelClass}>
              URL adresi <span className="text-white/25">{postUrl({ type: draft.type, slug: draft.slug || "..." })}</span>
              <input className={inputClass} value={draft.slug} onChange={(event) => set("slug", slugify(event.target.value))} />
            </label>

            <label className={`${labelClass} lg:col-span-2`}>
              Özet <span className="text-white/25">(listede ve arama sonuçlarında görünür)</span>
              <textarea rows={3} className={inputClass} value={draft.excerpt} onChange={(event) => set("excerpt", event.target.value)} />
            </label>

            <label className={labelClass}>
              Yayın tarihi
              <input
                type="date"
                className={inputClass}
                value={draft.publishedAt.slice(0, 10)}
                onChange={(event) => set("publishedAt", new Date(event.target.value || Date.now()).toISOString())}
              />
            </label>
          </div>

          <div className="mt-6">
            <ImageField
              label="Kapak görseli"
              url={draft.coverImage}
              alt={draft.coverAlt}
              onChange={({ url, alt }) => setDraft((current) => (current ? { ...current, coverImage: url, coverAlt: alt } : current))}
            />
          </div>
        </section>

        <section className="mt-6 border border-white/10 bg-[#202320] p-5 sm:p-7">
          <h3 className="mb-5 text-xl font-semibold">İçerik</h3>
          <BlockEditor blocks={draft.blocks} onChange={(blocks) => set("blocks", blocks)} />
        </section>

        <section className="mt-6 border border-white/10 bg-[#202320] p-5 sm:p-7">
          <h3 className="mb-5 text-xl font-semibold">SEO</h3>
          <div className="grid gap-5 lg:grid-cols-2">
            <label className={labelClass}>
              SEO başlığı <span className="text-white/25">(boşsa başlık kullanılır)</span>
              <input className={inputClass} value={draft.seoTitle} onChange={(event) => set("seoTitle", event.target.value)} />
            </label>
            <label className={labelClass}>
              SEO açıklaması <span className="text-white/25">({(draft.seoDescription || draft.excerpt).length}/160)</span>
              <textarea rows={3} className={inputClass} value={draft.seoDescription} onChange={(event) => set("seoDescription", event.target.value)} />
            </label>
          </div>
        </section>

        <div className="mt-7 flex flex-wrap justify-between gap-3">
          <button type="button" onClick={() => void remove(draft)} className={`${buttonClass} text-red-300`}>
            <Trash2 size={14} /> İçeriği sil
          </button>
          <button type="button" disabled={isSaving} onClick={save} className={primaryButtonClass}>
            <Save size={14} /> {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(Object.keys(postTypeLabels) as PostType[]).map((type) => (
          <button key={type} type="button" onClick={() => setDraft(newPost(type))} className={primaryButtonClass}>
            <Plus size={14} /> Yeni {postTypeLabels[type].toLowerCase()}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mb-5 border border-red-300/25 bg-red-300/10 px-5 py-4 text-sm text-red-200">{error}</p>}

      {(posts ?? []).length === 0 ? (
        <p className="border border-dashed border-white/15 px-6 py-12 text-center text-sm text-white/40">
          Henüz içerik yok. Yukarıdaki butonlarla ilk blog yazınızı veya tanıtımınızı oluşturun.
        </p>
      ) : (
        <ul className="space-y-2">
          {(posts ?? []).map((post) => (
            <li key={post.id}>
              <article className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-[#202320] p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-[.16em] text-[#d8b792]">{postTypeLabels[post.type]}</span>
                    <span className={`px-2 py-1 text-[8px] font-bold uppercase tracking-[.12em] ${post.published ? "bg-[#d8b792]/20 text-[#d8b792]" : "bg-white/10 text-white/45"}`}>
                      {post.published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <h3 className="mt-2 truncate text-lg font-semibold">{post.title || "(başlıksız)"}</h3>
                  <p className="mt-1 text-[11px] text-white/35">{postUrl(post)}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setDraft(post)} className={buttonClass}>Düzenle</button>
                  <button type="button" onClick={() => void remove(post)} aria-label="Sil" className={`${buttonClass} text-red-300`}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
