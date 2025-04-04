// API service for making requests to the backend

// Base URL for API requests
const API_URL = 'http://localhost:5000/api';

// Product API calls
export const fetchProducts = async (category?: string, culture?: string) => {
  let url = `${API_URL}/products`;
  
  // Add query parameters if provided
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (culture && culture !== 'All') params.append('culture', culture);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  return data.data;
};

export const fetchProduct = async (id: string) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  
  const data = await response.json();
  return data.data;
};

// User API calls
export const registerUser = async (userData: { name: string; email: string; password: string }) => {
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

// Wishlist API calls
export const addToWishlist = async (productId: string, token: string) => {
  const response = await fetch(`${API_URL}/users/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add to wishlist');
  }
  
  const data = await response.json();
  return data.data;
};

export const removeFromWishlist = async (productId: string, token: string) => {
  const response = await fetch(`${API_URL}/users/wishlist/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove from wishlist');
  }
  
  const data = await response.json();
  return data.data;
};

// Cart API calls
export const addToCart = async (productId: string, quantity: number, token: string) => {
  const response = await fetch(`${API_URL}/users/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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
      'Authorization': `Bearer ${token}`,
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
export const createOrder = async (orderData: any, token: string) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }
  
  const data = await response.json();
  return data.data;
};

export const getUserOrders = async (token: string) => {
  const response = await fetch(`${API_URL}/orders/myorders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch orders');
  }
  
  const data = await response.json();
  return data.data;
}; 