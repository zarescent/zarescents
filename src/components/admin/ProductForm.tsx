"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Star, Sparkles, Trash2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  convertImageToWebp,
  PRODUCT_IMAGE_RECOMMENDED,
} from "@/lib/image-webp";
import type { Product, ProductCategory } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function initialImages(product?: Product): string[] {
  const urls = (product?.image_urls || []).filter(Boolean);
  if (urls.length) return urls;
  return product?.image_url ? [product.image_url] : [];
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(() => initialImages(product));
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [newArrival, setNewArrival] = useState(product?.new_arrival ?? false);
  const [active, setActive] = useState(product?.active ?? true);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    const supabase = createClient();
    const next: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        continue;
      }
      if (file.size > PRODUCT_IMAGE_RECOMMENDED.maxUploadBytes) {
        setError("Each image must be under 5MB before upload.");
        continue;
      }

      let uploadFile: File;
      try {
        uploadFile = await convertImageToWebp(file);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not convert image to WebP."
        );
        continue;
      }

      const path = `${crypto.randomUUID()}.webp`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, uploadFile, {
          cacheControl: "31536000",
          upsert: false,
          contentType: "image/webp",
        });
      if (upErr) {
        setError(upErr.message);
        continue;
      }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      next.push(data.publicUrl);
    }

    if (next.length) setImages((prev) => [...prev, ...next].slice(0, 8));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  function setPrimary(url: string) {
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const payload = {
      name,
      slug: String(form.get("slug") || "").trim() || slugify(name),
      description: String(form.get("description") || "").trim(),
      short_description: String(form.get("short_description") || "").trim(),
      price: Number(form.get("price")),
      compare_at_price: form.get("compare_at_price")
        ? Number(form.get("compare_at_price"))
        : null,
      category: String(form.get("category")) as ProductCategory,
      volume: String(form.get("volume") || "50ml").trim(),
      scent_notes: String(form.get("scent_notes") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stock: Number(form.get("stock") || 0),
      image_url: images[0] || null,
      image_urls: images,
      featured,
      new_arrival: newArrival,
      active,
      sort_order: Number(form.get("sort_order") || 0),
    };

    const supabase = createClient();
    let { error: dbError } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    // Retry without new columns if DB migration not applied yet
    if (
      dbError &&
      /new_arrival|image_urls/i.test(dbError.message)
    ) {
      const {
        image_urls: _urls,
        new_arrival: _na,
        ...legacy
      } = payload;
      void _urls;
      void _na;
      const retry = product
        ? await supabase.from("products").update(legacy).eq("id", product.id)
        : await supabase.from("products").insert(legacy);
      dbError = retry.error;
      if (!dbError) {
        setError(
          "Product saved, but run supabase/patches/admin-product-images-collections.sql in Supabase to enable multi-image and New Arrival."
        );
        setLoading(false);
        router.push("/admin/products");
        router.refresh();
        return;
      }
    }

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <section className="admin-card p-5 sm:p-6 space-y-4">
        <h2 className="admin-section-label">Basic info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="admin-label">Name *</span>
            <input name="name" required defaultValue={product?.name} className="input-field" />
          </label>
          <label className="block">
            <span className="admin-label">Slug</span>
            <input
              name="slug"
              defaultValue={product?.slug}
              className="input-field"
              placeholder="auto-from-name"
            />
          </label>
          <label className="block">
            <span className="admin-label">Category *</span>
            <select
              name="category"
              required
              defaultValue={product?.category || "unisex"}
              className="input-field"
            >
              <option value="him">For Him</option>
              <option value="her">For Her</option>
              <option value="unisex">Unisex</option>
              <option value="testers">Testers</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="admin-label">Short description</span>
            <input
              name="short_description"
              defaultValue={product?.short_description}
              className="input-field"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="admin-label">Description</span>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description}
              className="input-field resize-none"
            />
          </label>
        </div>
      </section>

      <section className="admin-card p-5 sm:p-6 space-y-4">
        <h2 className="admin-section-label">Pricing & inventory</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="admin-label">Price (PKR) *</span>
            <input
              name="price"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={product ? Number(product.price) : ""}
              className="input-field"
            />
          </label>
          <label className="block">
            <span className="admin-label">Compare-at price</span>
            <input
              name="compare_at_price"
              type="number"
              min={0}
              step={1}
              defaultValue={
                product?.compare_at_price ? Number(product.compare_at_price) : ""
              }
              className="input-field"
            />
          </label>
          <label className="block">
            <span className="admin-label">Volume</span>
            <input
              name="volume"
              defaultValue={product?.volume || "50ml"}
              className="input-field"
            />
          </label>
          <label className="block">
            <span className="admin-label">Stock</span>
            <input
              name="stock"
              type="number"
              min={0}
              defaultValue={product?.stock ?? 0}
              className="input-field"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="admin-label">Scent notes (comma separated)</span>
            <input
              name="scent_notes"
              defaultValue={product?.scent_notes?.join(", ")}
              className="input-field"
              placeholder="Rose, Musk, Amber"
            />
          </label>
          <label className="block">
            <span className="admin-label">Sort order</span>
            <input
              name="sort_order"
              type="number"
              defaultValue={product?.sort_order ?? 0}
              className="input-field"
            />
          </label>
        </div>
      </section>

      <section className="admin-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="admin-section-label mb-0">Product images</h2>
          <p className="text-[0.65rem] text-muted">Up to 8 · first is primary</p>
        </div>

        <div className="rounded border border-[var(--border)] bg-white/[0.02] px-4 py-3 text-sm text-muted space-y-1.5">
          <p className="text-cream/90 text-xs uppercase tracking-[0.12em]">
            Recommended size
          </p>
          <p>
            <span className="text-cream">
              {PRODUCT_IMAGE_RECOMMENDED.width} × {PRODUCT_IMAGE_RECOMMENDED.height} px
            </span>{" "}
            ({PRODUCT_IMAGE_RECOMMENDED.aspect}). Clear bottle shot on a dark or
            neutral background works best.
          </p>
          <p>
            PNG, JPG, or WebP under 5MB. Uploads are{" "}
            <span className="text-cream">converted to WebP automatically</span>{" "}
            and resized to max {PRODUCT_IMAGE_RECOMMENDED.maxEdge}px on the long
            edge for faster storefront loading.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div
              key={url}
              className="group relative aspect-[3/4] overflow-hidden border border-[var(--border)] bg-[#12100e]"
            >
              <Image src={url} alt="" fill className="object-cover" sizes="160px" />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-gold/90 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider text-[#1a1410]">
                  Primary
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/70 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => setPrimary(url)}
                    className="flex-1 text-[0.55rem] uppercase tracking-wider text-cream hover:text-gold"
                  >
                    Primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="rounded p-1 text-danger hover:bg-danger/20"
                  aria-label="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {images.length < 8 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="aspect-[3/4] flex flex-col items-center justify-center gap-2 border border-dashed border-[var(--border-strong)] bg-[#12100e]/80 text-muted hover:border-gold/50 hover:text-cream transition-colors"
            >
              {uploading ? (
                <Upload size={22} className="animate-pulse" />
              ) : (
                <ImagePlus size={22} strokeWidth={1.5} />
              )}
              <span className="text-[0.65rem] uppercase tracking-[0.12em]">
                {uploading ? "Converting…" : "Upload"}
              </span>
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />

        <label className="block">
          <span className="admin-label">Or paste image URL</span>
          <div className="flex gap-2">
            <input
              id="manual-image-url"
              className="input-field"
              placeholder="https://… or /images/product.jpg"
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                const input = e.currentTarget;
                const url = input.value.trim();
                if (!url) return;
                setImages((prev) =>
                  prev.includes(url) ? prev : [...prev, url].slice(0, 8)
                );
                input.value = "";
              }}
            />
            <button
              type="button"
              className="btn-outline !min-h-0 !px-4 shrink-0"
              onClick={() => {
                const input = document.getElementById(
                  "manual-image-url"
                ) as HTMLInputElement | null;
                const url = input?.value.trim();
                if (!url) return;
                setImages((prev) =>
                  prev.includes(url) ? prev : [...prev, url].slice(0, 8)
                );
                if (input) input.value = "";
              }}
            >
              Add
            </button>
          </div>
        </label>
      </section>

      <section className="admin-card p-5 sm:p-6 space-y-4">
        <h2 className="admin-section-label">Storefront placement</h2>
        <p className="text-sm text-muted -mt-2">
          Choose where this product appears on the homepage and shop filters.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setFeatured((v) => !v)}
            className={`admin-toggle ${featured ? "is-on" : ""}`}
          >
            <Star size={18} strokeWidth={1.5} className={featured ? "text-gold" : ""} />
            <span>
              <span className="block text-sm text-cream">Featured</span>
              <span className="block text-[0.65rem] text-muted">Popular / homepage</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setNewArrival((v) => !v)}
            className={`admin-toggle ${newArrival ? "is-on" : ""}`}
          >
            <Sparkles
              size={18}
              strokeWidth={1.5}
              className={newArrival ? "text-gold" : ""}
            />
            <span>
              <span className="block text-sm text-cream">New arrival</span>
              <span className="block text-[0.65rem] text-muted">New collection</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActive((v) => !v)}
            className={`admin-toggle ${active ? "is-on" : ""}`}
          >
            {active ? (
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
            ) : (
              <X size={18} strokeWidth={1.5} />
            )}
            <span>
              <span className="block text-sm text-cream">
                {active ? "Active" : "Hidden"}
              </span>
              <span className="block text-[0.65rem] text-muted">Visible in shop</span>
            </span>
          </button>
        </div>
      </section>

      {error && (
        <p className="rounded border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-gold" disabled={loading || uploading}>
          {loading ? "Saving…" : product ? "Update product" : "Create product"}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
