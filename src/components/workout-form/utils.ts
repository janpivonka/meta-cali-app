import { ExerciseMedia } from "../../types";

export const generateId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const generateVideoThumbnail = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const container = document.createElement("div");
    container.style.display = "none";
    document.body.appendChild(container);
    container.appendChild(video);

    video.onloadeddata = () => {
      video.currentTime = 1;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailData = canvas.toDataURL("image/jpeg", 0.7);
      document.body.removeChild(container);
      resolve(thumbnailData);
    };

    video.onerror = () => {
      document.body.removeChild(container);
      resolve(null);
    };

    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);
    video.play();
  });
};

export const processFile = (file: File): Promise<ExerciseMedia | null> => {
  return new Promise(async (resolve) => {
    const isVideo = file.type.startsWith("video");
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB video, 10MB image

    if (file.size > maxSize) {
      alert(
        `Soubor ${file.name} je příliš velký (max ${isVideo ? "100MB" : "10MB"}).`,
      );
      resolve(null);
      return;
    }

    if (isVideo) {
      const thumbnail = await generateVideoThumbnail(file);
      resolve({ type: "video", url: file as any, thumbnail });
    } else {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.onload = async () => {
        try {
          if ("decode" in img) {
            await img.decode();
          }

          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width <= 0 || height <= 0) {
            URL.revokeObjectURL(url);
            resolve(null);
            return;
          }

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = Math.floor(width);
          canvas.height = Math.floor(height);

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(url);
            resolve(null);
            return;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          URL.revokeObjectURL(url);
          resolve({ type: "image", url: dataUrl });
        } catch (e) {
          console.error("Error processing image:", e);
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };

      img.src = url;
    }
  });
};
