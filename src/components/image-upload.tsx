"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { ACCEPTED_IMAGE_TYPES, uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  id: string;
  label: string;
  /** The current image URL (ImgBB, or a bundled /images/ path for seeded data). */
  value: string | null;
  onChange: (url: string | null) => void;
  /** "avatar": a round profile photo. "banner": a wide service image. */
  shape?: "avatar" | "banner";
  error?: string;
  hint?: string;
  /** Lets the parent block form submission while an upload is in flight. */
  onUploadingChange?: (isUploading: boolean) => void;
  allowRemove?: boolean;
};

/**
 * File input that uploads straight away (through the API to ImgBB) and shows a preview.
 * The parent form only ever stores the resulting URL.
 */
export function ImageUpload({
  id,
  label,
  value,
  onChange,
  shape = "banner",
  error,
  hint = "JPG, PNG, WebP or GIF, up to 5 MB.",
  onUploadingChange,
  allowRemove = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const message = uploadError ?? error;
  const describedById = message ? `${id}-error` : `${id}-hint`;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded.");
    } catch (caught) {
      const text = caught instanceof ApiError ? caught.message : "The image couldn’t be uploaded. Please try again.";
      setUploadError(text);
      toast.error(text);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
      // Allow choosing the same file again after an error.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isAvatar = shape === "avatar";

  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 text-xs font-semibold text-muted-foreground">
        {label}
      </p>
      <div className={cn("flex gap-4", isAvatar ? "items-center" : "flex-col")}>
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden border border-border bg-secondary text-muted-foreground",
            isAvatar ? "size-24 rounded-full" : "aspect-[16/9] w-full max-w-md rounded-xl",
            message && "border-error",
          )}
        >
          {value ? (
            <Image src={value} alt={`${label} preview`} fill sizes={isAvatar ? "96px" : "448px"} unoptimized={value.startsWith("https://")} className="object-cover" />
          ) : (
            <ImagePlus aria-hidden="true" className="size-8" strokeWidth={1.5} />
          )}
          {isUploading ? (
            <span className="absolute inset-0 flex items-center justify-center bg-background/70">
              <LoaderCircle aria-hidden="true" className="size-6 animate-spin text-accent" />
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="sr-only"
            aria-labelledby={`${id}-label`}
            aria-describedby={describedById}
            aria-invalid={Boolean(message)}
            disabled={isUploading}
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <Button type="button" variant="outline" disabled={isUploading} onClick={() => inputRef.current?.click()} className="h-10 rounded-lg px-4">
            <Upload aria-hidden="true" className="size-4" />
            {isUploading ? "Uploading…" : value ? "Change image" : "Upload image"}
          </Button>
          {allowRemove && value && !isUploading ? (
            <Button type="button" variant="ghost" onClick={() => onChange(null)} className="h-10 rounded-lg px-3 text-error hover:text-error">
              <Trash2 aria-hidden="true" className="size-4" /> Remove
            </Button>
          ) : null}
        </div>
      </div>
      {message ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-error">
          {message}
        </p>
      ) : (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
