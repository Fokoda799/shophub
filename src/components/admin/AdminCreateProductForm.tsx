"use client";

import { useRef, useState, useTransition } from "react";
import { createProductAction } from "@/actions/admin/products";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Upload, X, Check, AlertCircle, Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

type FileWithPreview = {
  file: File;
  preview: string;
};

export default function AdminCreateProductForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateFiles(fileList: File[]): string | null {
    if (fileList.length === 0) return "Please select at least one image";
    if (fileList.length > MAX_FILES) return `Maximum ${MAX_FILES} images allowed`;

    for (const file of fileList) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return `${file.name}: Invalid file type. Only JPG, PNG, WEBP allowed`;
      }
      if (file.size > MAX_FILE_SIZE) {
        return `${file.name}: File too large. Max 5MB per image`;
      }
    }

    return null;
  }

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files ?? []);
    const error = validateFiles(selectedFiles);

    if (error) {
      setErrors({ ...errors, images: error });
      return;
    }

    setErrors({ ...errors, images: "" });
    setFiles(
      selectedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
    );
  }

  function removeFile(index: number) {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    // Update the file input
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      newFiles.forEach((f) => dataTransfer.items.add(f.file));
      fileInputRef.current.files = dataTransfer.files;
    }

    // Clear error if no files left
    if (newFiles.length === 0) {
      setErrors({ ...errors, images: "Please select at least one image" });
    }
  }

  function validateForm(formData: FormData): boolean {
    const newErrors: Record<string, string> = {};

    const title = formData.get("title") as string;
    const price = formData.get("price") as string;

    if (!title?.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (files.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(formData: FormData) {
    setMsg(null);

    if (!validateForm(formData)) {
      return;
    }

    startTransition(async () => {
      try {
        await createProductAction(formData);
        
        setMsg({ type: "success", text: "Product created successfully!" });
        
        // Reset form
        formRef.current?.reset();
        setFiles([]);
        setErrors({});
        
        // Clear success message after 5 seconds
        setTimeout(() => setMsg(null), 5000);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create product";
        setMsg({ type: "error", text: message });
      }
    });
  }

  // Cleanup previews on unmount
  useState(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  });

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`
            mt-2 w-full rounded-lg border px-4 py-3 outline-none transition-colors
            ${errors.title 
              ? "border-red-500 focus:border-red-600" 
              : "border-gray-300 focus:border-gray-900"
            }
          `}
          placeholder="e.g. Minimal Tote Bag"
          disabled={isPending}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Price and Images Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (MAD) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            className={`
              mt-2 w-full rounded-lg border px-4 py-3 outline-none transition-colors
              ${errors.price 
                ? "border-red-500 focus:border-red-600" 
                : "border-gray-300 focus:border-gray-900"
              }
            `}
            placeholder="79.99"
            disabled={isPending}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.price}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Images (Max {MAX_FILES}) <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 relative">
            <input
              ref={fileInputRef}
              id="images"
              name="images"
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              multiple
              onChange={handleFilesChange}
              className="hidden"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className={`
                w-full rounded-lg border border-dashed px-4 py-3 text-sm font-medium
                transition-colors flex items-center justify-center gap-2
                ${errors.images 
                  ? "border-red-500 text-red-600 hover:bg-red-50" 
                  : "border-gray-300 text-gray-600 hover:border-gray-900 hover:bg-gray-50"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Upload className="h-4 w-4" />
              {files.length > 0 ? `${files.length} selected` : "Choose images"}
            </button>
          </div>
          {errors.images && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.images}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG, WEBP up to 5MB each
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-900 resize-none"
          placeholder="Add a detailed description of your product..."
          disabled={isPending}
        />
      </div>

      {/* Image Previews */}
      {files.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Preview ({files.length}/{MAX_FILES})
            </span>
            <button
              type="button"
              onClick={() => {
                setFiles([]);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
              disabled={isPending}
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {files.map((item, index) => (
              <div key={item.preview} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200 bg-white">
                  <Image
                    src={item.preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={isPending}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full px-5 py-3 rounded-lg bg-gray-900 text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            Create Product
          </>
        )}
      </Button>

      {/* Success/Error Message */}
      {msg && (
        <div
          className={`
            rounded-lg border px-4 py-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300
            ${msg.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
            }
          `}
        >
          {msg.type === "success" ? (
            <Check className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{msg.text}</p>
        </div>
      )}
    </form>
  );
}
