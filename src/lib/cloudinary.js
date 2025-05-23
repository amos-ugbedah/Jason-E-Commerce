// src/lib/cloudinary.js
import axios from "axios";
import { Cloudinary } from "@cloudinary/url-gen";

// Get Cloudinary config from environment variables
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

// Cloudinary SDK instance for generating images (e.g., cld.image())
const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName,
  },
});

/**
 * Uploads files to Cloudinary and returns public IDs
 * 
 * @param {File[]} files - Array of files to upload
 * @param {string} uploadPreset - Your unsigned upload preset name
 * @param {function} onProgress - Optional progress callback
 * @returns {Promise<{publicIds: string[], urls: string[]}>} - Returns both public IDs and URLs
 */
const uploadToCloudinary = async (files, uploadPreset, onProgress) => {
  const results = {
    publicIds: [],
    urls: []
  };

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          },
        }
      );

      results.publicIds.push(response.data.public_id);
      results.urls.push(response.data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  }

  return results;
};

// Helper function to extract public ID from URL
const getPublicIdFromUrl = (url) => {
  if (!url) return '';
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return url;
    const afterUpload = parts[1];
    return afterUpload.split('/').pop().split('.')[0];
  } catch {
    return url;
  }
};

export { uploadToCloudinary, cld, getPublicIdFromUrl };