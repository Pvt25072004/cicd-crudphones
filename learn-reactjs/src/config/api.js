/**
 * API Configuration
 * 
 * Cấu hình API URL cho cả local và production
 * 
 * Local development: 
 * - REACT_APP_API_URL=http://localhost:8080
 * 
 * Production (AWS EC2):
 * - REACT_APP_API_URL=https://your-domain.com (nếu dùng domain)
 * - REACT_APP_API_URL=http://your-ec2-ip:8080 (nếu dùng IP trực tiếp)
 * 
 * Nếu dùng Nginx proxy (như trong docker-compose):
 * - REACT_APP_API_URL có thể để trống hoặc dùng relative path
 * - Nginx sẽ proxy /api sang backend
 */

// Lấy API URL từ environment variable
// Nếu không có, dùng relative path (Nginx sẽ proxy)
const getApiUrl = () => {
  // Nếu có REACT_APP_API_URL, dùng nó
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Nếu không có, dùng relative path (cho Nginx proxy)
  // Trong production với Nginx, frontend và backend cùng domain
  // Nginx sẽ proxy /api sang backend container
  return "";
};

// Lấy Frontend URL từ environment variable
const getFrontendUrl = () => {
  if (process.env.REACT_APP_FRONTEND_URL) {
    return process.env.REACT_APP_FRONTEND_URL;
  }
  
  // Mặc định dùng current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  return "http://localhost:3000";
};

export const API_URL = getApiUrl();
export const FRONTEND_URL = getFrontendUrl();

// Helper function để tạo full API endpoint
export const getApiEndpoint = (endpoint) => {
  // Nếu endpoint đã có http/https, dùng trực tiếp
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  
  // Nếu API_URL là empty (dùng Nginx proxy), dùng relative path
  if (!API_URL) {
    return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  }
  
  // Nếu có API_URL, combine với endpoint
  const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};

// Log config trong development để debug
if (process.env.NODE_ENV === "development") {
  console.log("API Configuration:", {
    API_URL,
    FRONTEND_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
}

