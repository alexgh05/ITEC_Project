// API service for making requests to the backend
import { mockProducts } from './mockData';

// Base URL for API requests
const API_URL = 'http://localhost:5000/api';

// Product API calls
export const fetchProducts = async (category?: string, culture?: string, gender?: string) => {
  let url = `${API_URL}/products`;
  
  // Add query parameters if provided
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (culture && culture !== 'All') params.append('culture', culture);
  if (gender && gender !== 'All') params.append('gender', gender);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn('Using mock data for products due to API error:', error);
    
    // Filter mock data if category or culture is specified
    let filteredProducts = [...mockProducts];
    
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(
        product => product.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (culture && culture !== 'All') {
      filteredProducts = filteredProducts.filter(
        product => product.culture?.toLowerCase() === culture.toLowerCase()
      );
    }
    
    if (gender && gender !== 'All') {
      filteredProducts = filteredProducts.filter(
        product => product.gender?.toLowerCase() === gender.toLowerCase()
      );
    }
    
    return filteredProducts;
  }
};

export const fetchProduct = async (id: string) => {
  console.log('Fetching product with ID:', id);
  
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      console.error('Error fetching product:', response.status, response.statusText);
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    console.log('Product data received:', data.data);
    return data.data;
  } catch (error) {
    console.warn('Using mock data for product due to API error:', error);
    
    // Find product in mock data by ID
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }
};

// Helper function to get auth header
const getAuthHeader = (token) => {
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// User API calls
export const registerUser = async (userData: { name: string; email: string; password: string; role?: string }) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to register');
  }
  
  const data = await response.json();
  return data.data;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to login');
  }
  
  const data = await response.json();
  return data.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await fetch(`${API_URL}/users/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to request password reset');
  }
  
  const data = await response.json();
  
  // For development, log the preview URL
  if (data.previewUrl) {
    console.log('Email preview URL:', data.previewUrl);
    window.open(data.previewUrl, '_blank');
  }
  
  return data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(`${API_URL}/users/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reset password');
  }
  
  const data = await response.json();
  return data;
};

export const updateUserProfile = async (profileData: { 
  name?: string; 
  email?: string; 
  currentPassword?: string; 
  newPassword?: string; 
}, token: string) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(token),
    },
    body: JSON.stringify(profileData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update profile');
  }
  
  const data = await response.json();
  return data.user;
};

// Wishlist API calls
export const addToWishlist = async (productId: string, token: string) => {
  try {
    console.log(`Adding product to wishlist: ${productId}`);
    
    const response = await fetch(`${API_URL}/users/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token),
      },
      body: JSON.stringify({ productId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to add to wishlist:', error);
      throw new Error(error.error || 'Failed to add to wishlist');
    }
    
    const data = await response.json();
    console.log('Product added to wishlist:', data);
    return data.data;
  } catch (error) {
    console.error('Wishlist add error:', error);
    throw error;
  }
};

export const removeFromWishlist = async (productId: string, token: string) => {
  try {
    console.log(`Removing product from wishlist: ${productId}`);
    
    const response = await fetch(`${API_URL}/users/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(token),
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to remove from wishlist:', error);
      throw new Error(error.error || 'Failed to remove from wishlist');
    }
    
    const data = await response.json();
    console.log('Product removed from wishlist:', data);
    return data.data;
  } catch (error) {
    console.error('Wishlist remove error:', error);
    throw error;
  }
};

export const getUserWishlist = async (token: string) => {
  try {
    console.log('Fetching user wishlist');
    
    const response = await fetch(`${API_URL}/users/wishlist`, {
      method: 'GET',
      headers: {
        ...getAuthHeader(token),
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to fetch wishlist:', error);
      throw new Error(error.error || 'Failed to fetch wishlist');
    }
    
    const data = await response.json();
    console.log('Wishlist retrieved:', data);
    return data.data;
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    throw error;
  }
};

// Cart API calls
export const addToCart = async (productId: string, quantity: number, token: string) => {
  const response = await fetch(`${API_URL}/users/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(token),
    },
    body: JSON.stringify({ productId, quantity }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add to cart');
  }
  
  const data = await response.json();
  return data.data;
};

export const removeFromCart = async (productId: string, token: string) => {
  const response = await fetch(`${API_URL}/users/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(token),
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove from cart');
  }
  
  const data = await response.json();
  return data.data;
};

// Order API calls
export const createOrder = async (orderData: any, token?: string) => {
  // Choose the appropriate endpoint based on whether a token is provided
  const endpoint = token ? `${API_URL}/orders` : `${API_URL}/orders/guest`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Only add auth header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log(`Sending order to ${endpoint}${token ? ' with auth token' : ' as guest'}`);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    
    const data = await response.json();
    console.log('Order API response:', data);
    return {
      ...data.data,
      emailSent: data.emailSent,
      emailPreviewUrl: data.emailPreviewUrl,
      isGuest: data.isGuest
    };
  } catch (error) {
    console.error('Order API error:', error);
    throw error;
  }
};

export const getUserOrders = async (token: string) => {
  const response = await fetch(`${API_URL}/orders/myorders`, {
    headers: {
      ...getAuthHeader(token),
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch orders');
  }
  
  const data = await response.json();
  return data.data;
};

export const getAdminOrders = async (token: string) => {
  const response = await fetch(`${API_URL}/orders/admin`, {
    headers: {
      ...getAuthHeader(token),
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch admin orders');
  }
  
  const data = await response.json();
  return data.data;
};

export const updateOrderToDelivered = async (orderId: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/deliver`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(token),
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update order status');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in updateOrderToDelivered:', error);
    
    // Fallback to test endpoint if the regular endpoint fails
    try {
      console.log('Falling back to test endpoint');
      const testResponse = await fetch(`${API_URL}/orders/test/${orderId}/deliver`, {
        method: 'PUT',
      });
      
      if (!testResponse.ok) {
        const testError = await testResponse.json();
        throw new Error(testError.error || 'Failed to update order status (test endpoint)');
      }
      
      const testData = await testResponse.json();
      return testData.data;
    } catch (testError) {
      console.error('Error in test endpoint fallback:', testError);
      throw testError;
    }
  }
};

// Product API calls
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch products');
  }
  
  const data = await response.json();
  return data.data;
};

// Admin API calls
export const createProduct = async (productData: any, token: string) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(token),
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create product');
  }
  
  const data = await response.json();
  return data.data;
};

export const updateProduct = async (productId: string, productData: any, token: string) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(token),
    },
    body: JSON.stringify(productData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update product');
  }
  
  const data = await response.json();
  return data.data;
};

export const deleteProduct = async (productId: string, token: string) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(token),
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete product');
  }
  
  const data = await response.json();
  return data.data;
};

// Get admin dashboard statistics
export const getAdminStats = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: {
      ...getAuthHeader(token),
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch admin stats');
  }
  
  const data = await response.json();
  return data.data;
};

// Get all users for admin
export const getAdminUsers = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: {
      ...getAuthHeader(token),
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch users');
  }
  
  const data = await response.json();
  return data.data;
};

// Upload product image
export const uploadProductImage = async (file: File, productId: string | null, token: string, imageIndex?: number) => {
  // Create FormData object
  const formData = new FormData();
  formData.append('images', file);
  
  // If productId is provided, add it to request
  if (productId) {
    formData.append('productId', productId);
  }
  
  // If imageIndex is provided, add it to request
  if (typeof imageIndex === 'number') {
    formData.append('imageIndex', imageIndex.toString());
  }
  
  const response = await fetch(`${API_URL}/products/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(token),
      // Don't set Content-Type header as it will be automatically set with boundary for FormData
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }
  
  const data = await response.json();
  return data;
};

export const getStoreSettings = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/settings`, {
    headers: {
      ...getAuthHeader(token),
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch store settings');
  }

  const data = await response.json();
  return data.data;
};

export const updateStoreSettings = async (settingsData: any, token: string) => {
  const response = await fetch(`${API_URL}/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(token),
    },
    body: JSON.stringify(settingsData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update store settings');
  }

  const data = await response.json();
  return data;
};

// Google Authentication API calls
export const loginWithGoogleApi = async (credential: string) => {
  const response = await fetch(`${API_URL}/users/google/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to login with Google');
  }
  
  const data = await response.json();
  return data.data;
};

export const registerWithGoogleApi = async (credential: string, role: string = 'user') => {
  const response = await fetch(`${API_URL}/users/google/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential, role }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to register with Google');
  }
  
  const data = await response.json();
  return data.data;
}; 