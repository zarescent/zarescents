"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const current = list[active] || list[0];

  if (!current) {
    return (
      <div className="relative aspect-[3/4] bg-bg-soft overflow-hidden" />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] bg-bg-soft overflow-hidden">
        <Image
          src={current}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-12 shrink-0 overflow-hidden border transition-colors ${
                i === active
                  ? "border-gold"
                  : "border-[var(--border)] hover:border-gold/40"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="48px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
