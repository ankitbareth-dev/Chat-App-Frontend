import { ENV } from "../app/env";

export const uploadVoiceNoteApi = async (
  file: Blob,
): Promise<{ url: string; duration: number }> => {
  const formData = new FormData();
  formData.append("voice", file);

  const res = await fetch(`${ENV.API_BASE_URL}/api/chats/upload-voice`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to upload voice note");
  }

  const data = await res.json();
  return data.data;
};

export const uploadMediaApi = async (
  file: File,
): Promise<{
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  duration?: number;
}> => {
  const formData = new FormData();
  formData.append("media", file);

  const res = await fetch(`${ENV.API_BASE_URL}/api/chats/upload-media`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to upload media");
  }

  const data = await res.json();
  return data.data;
};
