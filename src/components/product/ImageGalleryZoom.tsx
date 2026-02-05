"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";

type Props = {
  imageUrls: string[];
  alt: string;
};

export default function ImageGalleryZoom({ imageUrls, alt }: Props) {
  const [active, setActive] = useState(0);
  const [isZoom, setIsZoom] = useState(false);
  const [bgPos, setBgPos] = useState("50% 50%");
  const [isMobileZoom, setIsMobileZoom] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeUrl = useMemo(() => imageUrls[active], [imageUrls, active]);

  /* ---------------- Desktop hover zoom ---------------- */
  function onMouseMove(e: React.MouseEvent) {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setBgPos(`${x}% ${y}%`);
  }

  /* ---------------- Mobile tap + drag zoom ---------------- */
  function onTouchMove(e: React.TouchEvent) {
    if (!isMobileZoom) return;

    const el = containerRef.current;
    if (!el) return;

    const touch = e.touches[0];
    const rect = el.getBoundingClientRect();

    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    setBgPos(`${x}% ${y}%`);
  }

  function toggleMobileZoom() {
    setIsMobileZoom((z) => !z);
  }

  function prev() {
    setActive((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  }

  function next() {
    setActive((i) => (i + 1) % imageUrls.length);
  }

  if (imageUrls.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        ref={containerRef}
        className="relative h-[400px] overflow-hidden bg-white md:h-[600px]"
        onMouseEnter={() => setIsZoom(true)}
        onMouseLeave={() => setIsZoom(false)}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onClick={toggleMobileZoom}
      >
        {/* Base image */}
        <Image
          src={activeUrl}
          alt={alt}
          fill
          priority
          className={`transition-transform duration-300 ${
            isMobileZoom ? "scale-150" : "scale-100"
          } object-contain`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Desktop hover zoom overlay */}
        {isZoom && (
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              backgroundImage: `url(${activeUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: bgPos,
              backgroundSize: "200%",
              cursor: "zoom-in",
            }}
          />
        )}

        {/* Navigation arrows */}
        {imageUrls.length > 1 && (
          <>
            <Button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 md:left-4"
            >
              ‹
            </Button>
            <Button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 md:right-4"
            >
              ›
            </Button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 text-xs font-bold">
          {active + 1} / {imageUrls.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {imageUrls.map((url, idx) => (
          <Button
            key={idx}
            onClick={() => setActive(idx)}
            className={`relative h-16 w-16 shrink-0 border-2 ${
              idx === active ? "border-black" : "border-gray-200"
            }`}
          >
            <Image src={url} alt="" fill className="object-cover" />
          </Button>
        ))}
      </div>

      {/* Tips */}
      <p className="text-xs uppercase tracking-wide text-gray-500">
        <span className="hidden md:inline">Hover to zoom</span>
        <span className="md:hidden">Tap to zoom • Drag to move</span>
      </p>
    </div>
  );
}
