export class ApiError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

let onUnauthorized = null;

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5153/api").replace(/\/$/, "");

async function request(endpoint, options = {}) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${normalizedEndpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor.");
  }

  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  const isSuccess = response.ok && (json ? json.success !== false : false);

  if (!isSuccess) {
    const isLoginEndpoint = normalizedEndpoint.includes("/login") || normalizedEndpoint.includes("auth/login");
    if (response.status === 401 && !isLoginEndpoint && typeof onUnauthorized === "function") {
      onUnauthorized();
    }

    const message = json?.message || (response.status ? `Error HTTP ${response.status}` : "Error desconocido en la solicitud.");
    const errors = json?.errors ?? null;
    throw new ApiError(response.status, message, errors);
  }

  return json ? json.data : null;
}

export function get(endpoint, options = {}) {
  return request(endpoint, { ...options, method: "GET" });
}

export function post(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function patch(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export const apiClient = {
  get,
  post,
  patch,
};

export default apiClient;
