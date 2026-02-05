"use client";

import { useRef, useState } from "react";
import { createProductAction } from "@/app/[locale]/admin/actions";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function AdminCreateProductForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [msg, setMsg] = useState<string>("");

  const [previews, setPreviews] = useState<string[]>([]);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function action(formData: FormData) {
    setMsg("");
    try {
      await createProductAction(formData);
      setMsg("✅ Product created");
      formRef.current?.reset();
      setPreviews([]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      setMsg(`❌ ${message}`);
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
          placeholder="e.g. Minimal Tote Bag"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Price</label>
          <input
            name="price"
            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
            placeholder="79.99"
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
          rows={4}
          className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
          placeholder="Short description..."
        />
      </div>

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

      <Button className="w-full px-5 py-3 rounded-2xl bg-black text-white hover:opacity-90">
        Create product
      </Button>

      {msg && (
        <div className="text-sm rounded-2xl border border-black/10 bg-black/5 px-4 py-3">
          {msg}
        </div>
      )}
    </form>
  );
}
