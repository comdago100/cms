"use client";

import { useEffect } from "react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, caption, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-4xl flex-col items-center overflow-hidden rounded-2xl bg-slate-900 p-2 shadow-2xl border border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-blue-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        <img
          src={src}
          alt={alt}
          className="max-h-[78vh] w-auto rounded-xl object-contain"
        />

        <div className="w-full px-4 py-3 text-center">
          <p className="text-sm font-bold text-white">{alt}</p>
          {caption && <p className="mt-0.5 text-xs text-slate-300">{caption}</p>}
        </div>
      </div>
    </div>
  );
}
