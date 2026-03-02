const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  // If the body is FormData, let fetch set the headers (don't set Content-Type)
  const isForm = typeof FormData !== "undefined" && options.body instanceof FormData;

  const fetchOptions = {
    cache: "no-store",
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(isForm ? {} : { "Content-Type": "application/json" }),
    },
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const text = await res.text();
    const errMsg = text || `HTTP ${res.status} ${res.statusText}`;
    console.error("API ERROR:", res.status, res.statusText, text);
    throw new Error(errMsg);
  }

  return res.json();
};
