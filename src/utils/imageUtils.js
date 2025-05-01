/**
 * Image utility functions for Cloudinary-backed image operations
 * All operations flow through the backend API which then communicates with Cloudinary
 */

// Base URL for backend server API 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';
// Default placeholder image path (for fallbacks)
const DEFAULT_IMAGE_PATH = '/assets/product-md.jpg';

/**
 * Get a local placeholder image by size
 * @param {string} size - sm (100px), md (150px), lg (300px), xl (600px)
 * @returns {string} image URL
 */
export const getLocalImage = (size = 'md') => {
  const sizeMap = {
    sm: 'product-sm.jpg',
    md: 'product-md.jpg',
    lg: 'product-lg.jpg',
    xl: 'product-xl.jpg'
  };
  return `/assets/${sizeMap[size] || sizeMap.md}`;
};

/**
 * Get a local avatar placeholder image
 * @returns {string} avatar image URL
 */
export const getAvatarImage = () => '/assets/product-sm.jpg';

/**
 * Get the best URL for an image reference (direct URL or backend API)
 * @param {string|object} image - Image URL, ID, or image object
 * @returns {string} The image URL
 */
export const getUploadedImageUrl = (image) => {
  // Fallback for no image
  if (!image) return DEFAULT_IMAGE_PATH;
  
  // If image is a string
  if (typeof image === 'string') {
    // If the path is already a full URL (Cloudinary or any other URL), return it as is
    if (image.startsWith('http')) return image;
    
    // Check if this is a local file (assets)
    if (image.includes('/assets/')) {
      return image; // Return as is - it's a local file
    }
    
    // If it's an ID, use our API to fetch by ID
    if (/^\d+$/.test(image)) {
      return `${API_URL}/images/get/${image}`;
    }
    
    // Default to getting by ID
    return `${API_URL}/images/get/${image}`;
  }
  
  // If image is an object with url property (from Cloudinary)
  if (typeof image === 'object' && image.url) {
    return image.url;
  }
  
  // If image is an object with id property
  if (typeof image === 'object' && image.id) {
    return `${API_URL}/images/get/${image.id}`;
  }
  
  // Fallback to default image
  return DEFAULT_IMAGE_PATH;
};

/**
 * Upload an image to Cloudinary via backend API
 * @param {File} file - The file object to upload
 * @param {string} folder - The folder for organizing images (e.g., 'products', 'profiles')
 * @param {string} token - JWT auth token (required for admin authorization)
 * @param {string} publicId - Optional Cloudinary public_id
 * @returns {Promise<object>} Response with upload status and image URLs
 */
export const uploadImage = async (file, folder = 'general', token = null, publicId = null) => {
  try {
    // Validate file type (allow only images)
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Check if we have authentication (admin only)
    if (!token) {
      throw new Error('Authentication required for image upload');
    }

    // Create form data for the file upload
    const formData = new FormData();
    formData.append('image', file);

    // Build the URL with query parameters
    let uploadUrl = `${API_URL}/images/upload?folder=${folder}`;
    if (publicId) {
      uploadUrl += `&public_id=${encodeURIComponent(publicId)}`;
    }

    // Make the API request to upload the image
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    // Parse and return the response data
    const data = await response.json();
    
    // Return response with imageUrl property for backward compatibility
    return {
      ...data,
      imageUrl: data.url
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Get image metadata by ID from the backend
 * @param {string|number} id - The image ID
 * @returns {Promise<object|null>} The image data
 */
export const getImageById = async (id) => {
  try {
    if (!id) return null;
    
    const response = await fetch(`${API_URL}/images/get/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

/**
 * Get image metadata by URL from the backend
 * @param {string} url - The image URL
 * @returns {Promise<object|null>} The image data
 */
export const getImageByUrl = async (url) => {
  try {
    if (!url) return null;
    
    const response = await fetch(`${API_URL}/images/by-url?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch image by URL');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching image by URL:', error);
    return null;
  }
};

/**
 * Get a paginated list of images from the backend (admin only)
 * @param {number} page - Page number (starts at 1)
 * @param {number} limit - Items per page
 * @param {string} folder - Optional folder filter
 * @param {string} token - JWT auth token (required for admin access)
 * @returns {Promise<object|null>} Images list with pagination info
 */
export const getImagesList = async (page = 1, limit = 20, folder = null, token = null) => {
  try {
    let url = `${API_URL}/images/list?page=${page}&limit=${limit}`;
    if (folder) url += `&folder=${encodeURIComponent(folder)}`;
    
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch images list');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching images list:', error);
    return null;
  }
};

/**
 * Delete an image by ID (admin only)
 * @param {string|number} id - The image ID
 * @param {string} token - JWT auth token (required for admin access)
 * @returns {Promise<object|null>} Deletion result
 */
export const deleteImage = async (id, token) => {
  try {
    if (!id || !token) {
      throw new Error('Image ID and auth token are required');
    }
    
    const response = await fetch(`${API_URL}/images/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting image:', error);
    return null;
  }
};

// Export as a named object for default export
const imageUtils = {
  getLocalImage,
  getAvatarImage,
  getUploadedImageUrl,
  uploadImage,
  getImageById,
  getImageByUrl,
  getImagesList,
  deleteImage
};

export default imageUtils;
