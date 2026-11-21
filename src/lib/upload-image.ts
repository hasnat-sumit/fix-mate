import { ApiError } from "@/lib/api-client";
import { getApiToken } from "@/lib/auth-client";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** A message for a file the server would reject, or null when it looks fine. The server re-checks everything. */
export function imageFileProblem(file: File) {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) return "Choose a JPG, PNG, WebP or GIF image.";
  if (file.size > MAX_IMAGE_BYTES) return "Images must be 5 MB or smaller.";
  return null;
}

/**
 * Uploads an image through the API, which forwards it to ImgBB with the server's key (never exposed here).
 * Resolves to the hosted https URL; throws ApiError with a user-facing message otherwise.
 */
export async function uploadImage(file: File): Promise<string> {
  const problem = imageFileProblem(file);
  if (problem) throw new ApiError(400, "BAD_REQUEST", problem);

  const token = await getApiToken();
  if (!token) throw new ApiError(401, "UNAUTHORIZED", "Please sign in to upload images.");

  let response: Response;
  try {
    response = await fetch("/api/uploads/image", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": file.type },
      body: file,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "We couldn’t reach FixMate. Check your connection and try again.");
  }

  const json = (await response.json().catch(() => null)) as { data?: { url?: string }; code?: string; message?: string } | null;
  const url = json?.data?.url;
  if (!response.ok || !url) {
    throw new ApiError(response.status, json?.code ?? "UNKNOWN", json?.message ?? "The image couldn’t be uploaded. Please try again.");
  }
  return url;
}
