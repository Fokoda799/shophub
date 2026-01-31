"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";


type Props = {
  imageUrls: string[];
  alt: string;
};

export default function ImageGalleryZoom({ imageUrls, alt }: Props) {

  const [active, setActive] = useState(0);

  // zoom states
  const [isZoom, setIsZoom] = useState(false);
  const [bgPos, setBgPos] = useState("50% 50%");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeUrl = useMemo(() => imageUrls[active], [imageUrls, active]);

  function onMove(e: React.MouseEvent) {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // clamp 0..100
    const cx = Math.max(0, Math.min(100, x));
    const cy = Math.max(0, Math.min(100, y));
    setBgPos(`${cx}% ${cy}%`);
  }

  function prev() {
    setActive((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  }
  function next() {
    setActive((i) => (i + 1) % imageUrls.length);
  }

  if (imageUrls.length === 0) {
    return (
      <div className="rounded-2xl bg-black/5 h-[420px] flex items-center justify-center text-black/50">
        No images
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={prev}
          className="px-3 py-2 rounded-xl border border-black/10 hover:bg-black/5"
          aria-label="Previous image"
        >
          ◀
        </button>
        <div className="text-sm text-black/60">
          {active + 1} / {imageUrls.length}
        </div>
        <button
          onClick={next}
          className="px-3 py-2 rounded-xl border border-black/10 hover:bg-black/5"
          aria-label="Next image"
        >
          ▶
        </button>
      </div>

      {/* Main image with magnifier */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border border-black/10 bg-black/5 h-[420px] select-none"
        onMouseEnter={() => setIsZoom(true)}
        onMouseLeave={() => setIsZoom(false)}
        onMouseMove={onMove}
      >
        {/* Base image */}
        <Image
          src={activeUrl}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Zoom overlay (simple magnifier effect using background-image) */}
        {isZoom && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${activeUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: bgPos,
              backgroundSize: "220%", // zoom strength
              // light overlay so you can feel zoomed view
              cursor: "zoom-in",
            }}
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {imageUrls.map((url, idx) => {
          const isActive = idx === active;
          return (
            <button
              key={url + idx}
              onClick={() => setActive(idx)}
              className={[
                "relative h-20 w-20 rounded-xl overflow-hidden border",
                isActive ? "border-black/60" : "border-black/10 hover:border-black/30",
              ].join(" ")}
              aria-label={`Select image ${idx + 1}`}
            >
              <Image src={url} alt={`${alt} thumb ${idx + 1}`} fill className="object-cover" />
            </button>
          );
        })}
      </div>

      <p className="text-xs text-black/50">
        Tip: hover the main image to zoom, move mouse to pan.
      </p>
    </div>
  );
}
