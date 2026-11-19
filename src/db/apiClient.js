let RAW_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").trim();
RAW_BASE_URL = RAW_BASE_URL.endsWith("/") ? RAW_BASE_URL.slice(0, -1) : RAW_BASE_URL;

// If user provided backend domain without /api (e.g. https://xyz.onrender.com), automatically append /api
if (RAW_BASE_URL.startsWith("http") && !RAW_BASE_URL.endsWith("/api")) {
  RAW_BASE_URL = `${RAW_BASE_URL}/api`;
}

const BASE_URL = RAW_BASE_URL;

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If the body is NOT FormData, default to application/json
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    if (typeof options.body === "object") {
      options.body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // JSON parsing failed, use status text or default
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses (like 204 No Content or delete requests)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
}
