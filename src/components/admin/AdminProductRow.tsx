"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ProductDoc } from "@/types/product";
import { deleteProductAction, updateProductAction } from "@/actions/admin/products";
import { useLocalizedPath } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";

export default function AdminProductRow({ product }: { product: ProductDoc }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const localize = useLocalizedPath();

  const editRef = useRef<HTMLFormElement | null>(null);

  async function onUpdate(formData: FormData) {
    setMsg("");
    try {
      formData.set("productId", product.$id);
      formData.set("existingImageIds", JSON.stringify(product.imageFileIds ?? []));
      await updateProductAction(formData);
      setMsg("✅ Updated. Refresh the page to see changes.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      setMsg(`❌ ${message}`);
    }
  }

  async function onDelete(deleteImages: boolean) {
    setMsg("");
    try {
      const fd = new FormData();
      fd.set("productId", product.$id);
      fd.set("deleteImages", deleteImages ? "yes" : "no");
      fd.set("imageIds", JSON.stringify(product.imageFileIds ?? []));
      await deleteProductAction(fd);
      setMsg("✅ Deleted. Refresh the page to see changes.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      setMsg(`❌ ${message}`);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{product.title}</div>
          <div className="text-xs text-black/60">
            ${product.price.toFixed(2)} • {(product.imageFileIds?.length ?? 0)} images
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setOpen((v) => !v)}
            className="px-3 py-2 rounded-xl border border-black/10 hover:bg-black/5 text-sm"
          >
            {open ? "Close" : "Edit"}
          </Button>
          <Link
            href={localize(`/product/${product.$id}`)}
            className="px-3 py-2 rounded-xl hover:bg-black/5 text-sm"
          >
            View
          </Link>
        </div>
      </div>

      {open && (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
          <form ref={editRef} action={onUpdate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  name="title"
                  defaultValue={product.title}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <input
                  name="price"
                  defaultValue={String(product.price)}
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={product.description ?? ""}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <label className="text-sm font-medium">
                  Add / Replace images
                </label>
                <input
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Image mode</label>
                <select
                  name="imageMode"
                  defaultValue="append"
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 bg-white"
                >
                  <option value="append">Append (keep old + add new)</option>
                  <option value="replace">Replace (remove old from product)</option>
                </select>
                <div className="text-xs text-black/60 mt-1">
                  Replace removes old references; you can also delete old files below.
                </div>
              </div>
            </div>

            <Button className="w-full px-5 py-3 rounded-2xl bg-black text-white hover:opacity-90">
              Save changes
            </Button>
          </form>

          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => onDelete(false)}
              className="px-5 py-3 rounded-2xl border border-black/10 hover:bg-black/5 text-sm"
            >
              Delete product (keep images)
            </Button>
            <Button
              onClick={() => onDelete(true)}
              className="px-5 py-3 rounded-2xl bg-black text-white hover:opacity-90 text-sm"
            >
              Delete product + images
            </Button>
          </div>

          {msg && (
            <div className="mt-3 text-sm rounded-2xl border border-black/10 bg-black/5 px-4 py-3">
              {msg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
