import { ENV } from "../app/env";

type ProgressCallback = (progress: number) => void;

export const uploadMediaWithProgress = (
  file: File,
  onProgress: ProgressCallback,
): Promise<{
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  duration?: number;
}> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("media", file);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.data);
        } catch (e) {
          reject(new Error("Invalid server response"));
        }
      } else {
        reject(new Error("Upload failed"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("POST", `${ENV.API_BASE_URL}/api/chats/upload-media`, true);
    xhr.withCredentials = true;
    xhr.send(formData);
  });
};

export const downloadFileWithProgress = (
  url: string,
  onProgress: ProgressCallback,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    xhr.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error("Download failed"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Download error")));
    xhr.send();
  });
};

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
  if (!res.ok) throw new Error("Failed to upload voice note");
  const data = await res.json();
  return data.data;
};
