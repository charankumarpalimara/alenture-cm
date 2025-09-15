// Centralized API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://alantur-api.softplix.com";
const WS_URL = process.env.REACT_APP_WS_URL || "ws://161.35.54.196:8080";

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/v1/${cleanEndpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = sessionStorage.getItem('cmtoken') || 
                sessionStorage.getItem('crmtoken') || 
                sessionStorage.getItem('hobtoken') || 
                sessionStorage.getItem('token');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function for API calls with error handling
export const apiCall = async (endpoint, options = {}) => {
  try {
    const url = buildApiUrl(endpoint);
    const headers = {
      ...getAuthHeaders(),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export { API_BASE_URL, WS_URL };