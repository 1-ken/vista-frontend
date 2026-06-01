const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd';

export default function getImageUrl(image) {
  if (!image) return DEFAULT_PLACEHOLDER;
  if (typeof image !== 'string') return image;

  // If the backend stores uploaded files as /uploads/..., resolve against API origin
  if (image.startsWith('/uploads')) {
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.split('/api')[0]
      : 'http://localhost:5000';

    return `${baseUrl}${image}`;
  }

  return image;
}
