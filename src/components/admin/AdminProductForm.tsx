"use client";

import { useRef, useState } from "react";
import { createProductAction } from "@/actions/admin/products";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function AdminProductForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<
    { type: "idle" | "loading" | "success" | "error"; message?: string } | undefined
  >({ type: "idle" });

  const [previews, setPreviews] = useState<string[]>([]);

  async function onSubmit(formData: FormData) {
    try {
      setStatus({ type: "loading", message: "Uploading..." });
      const res = await createProductAction(formData);

      setStatus({ type: "success", message: `Created product: ${res.id}` });

      // Reset
      formRef.current?.reset();
      setPreviews([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setStatus({
        type: "error",
        message,
      });
    }
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  return (
    <form ref={formRef} action={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          placeholder="e.g. Minimal Tote Bag"
          className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Price</label>
          <input
            name="price"
            placeholder="79.99"
            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Images</label>
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={onFilesChange}
            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 bg-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          placeholder="Short description..."
          rows={4}
          className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
        />
      </div>

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="rounded-2xl border border-black/10 p-3">
          <div className="text-sm font-semibold">Preview</div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {previews.map((src) => (
              <Image
                key={src}
                src={src}
                className="h-20 w-20 rounded-xl object-cover border border-black/10"
                alt="preview"
                width={80}
                height={80}
              />
            ))}
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={status?.type === "loading"}
        className="w-full px-5 py-3 rounded-2xl bg-black text-white hover:opacity-90 disabled:opacity-60"
      >
        {status?.type === "loading" ? "Uploading..." : "Create product"}
      </Button>

      {status?.type !== "idle" && status?.message && (
        <div
          className={[
            "text-sm rounded-2xl border px-4 py-3",
            status.type === "success"
              ? "border-black/10 bg-black/5 text-black"
              : status.type === "error"
              ? "border-black/15 bg-black/5 text-black"
              : "border-black/10 bg-black/5 text-black",
          ].join(" ")}
        >
          {status.message}
        </div>
      )}
    </form>
  );
}
