"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Technician-supplied images are arbitrary https URLs, so they bypass the image optimizer
 * (which would otherwise act as an open proxy for any host). Bundled /images/ files are optimized.
 */
export function isRemoteImage(src: string) {
  return src.startsWith("https://");
}

type ServiceImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
};

/** A fill-mode service image that falls back to a neutral placeholder if the URL fails to load. */
export function ServiceImage({ src, alt, sizes, className, preload }: ServiceImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div role={alt ? "img" : undefined} aria-label={alt ? `${alt} (image unavailable)` : undefined} className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground">
        <ImageOff aria-hidden="true" className="size-8" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      preload={preload}
      unoptimized={isRemoteImage(src)}
      sizes={sizes}
      onError={() => setFailedSrc(src)}
      className={cn("object-cover", className)}
    />
  );
}
