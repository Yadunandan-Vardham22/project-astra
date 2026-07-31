const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

if (!CLOUD_NAME || !UPLOAD_PRESET || CLOUD_NAME.includes("your-") || UPLOAD_PRESET.includes("your-")) {
  console.error("[Cloudinary] missing or placeholder configuration", {
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
  });
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  format?: string;
  bytes?: number;
  originalFilename?: string;
  width?: number;
  height?: number;
  duration?: number;
  createdAt?: string | number;
}

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);
  formData.append("use_filename", "true");
  formData.append("unique_filename", "true");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Cloudinary] upload failed", {
      status: response.status,
      statusText: response.statusText,
      errorText,
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
    });
    throw new Error(
      `Cloudinary upload failed (${response.status} ${response.statusText}). Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.`
    );
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    bytes: data.bytes,
    originalFilename: data.original_filename ?? file.name,
    width: data.width,
    height: data.height,
    duration: data.duration,
    createdAt: data.created_at,
  };
}