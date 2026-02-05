"use client";

import { useEffect } from "react";
import Button from "../ui/Button";
import { useLanguage } from "@/context/LanguageContext";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  url: string;
  title?: string;
};

export default function ShareModal({
  open,
  onClose,
  url,
  title,
}: ShareModalProps) {
  const t = useLanguage("product").product.share_modal;
  const shareTitle = title ?? t.share_this_product;

  useEffect(() => {
    if (!open) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url });
      } catch {}
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(url);
    alert(t.link_copied);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[90%] max-w-sm bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black uppercase tracking-wide text-gray-900">
            {t.share}
          </h3>
          <Button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </Button>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Native share (mobile) */}
          {"share" in navigator && (
            <Button
              onClick={nativeShare}
              className="w-full bg-gray-900 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-gray-800"
            >
              {t.share_via_app}
            </Button>
          )}

          {/* Copy link */}
          <Button
            onClick={copyLink}
            className="w-full border border-gray-300 py-3 text-sm font-bold uppercase tracking-wide text-gray-900 hover:bg-gray-100 hover:border-gray-900"
          >
            {t.copy_link}
          </Button>

          {/* Social */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
              )}`}
              target="_blank"
              className="rounded-lg bg-blue-600 py-3 text-center text-xs font-bold uppercase text-white"
            >
              Facebook
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url
              )}`}
              target="_blank"
              className="rounded-lg bg-black py-3 text-center text-xs font-bold uppercase text-white"
            >
              X
            </a>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(url)}`}
              target="_blank"
              className="rounded-lg bg-green-500 py-3 text-center text-xs font-bold uppercase text-white"
            >
              {t.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
