const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd';

export default function getImageUrl(image) {
  if (!image) return DEFAULT_PLACEHOLDER;
  if (typeof image !== 'string') return image;

  if (image.startsWith('/uploads')) {
    const baseUrl = (import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.VITE_TASK_API_URL || 'http://localhost:5000').replace(/\/$/, '');
    return `${baseUrl}${image}`;
  }

  return image;
}
