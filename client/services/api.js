const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAPI = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    const errMsg = text || `HTTP ${res.status} ${res.statusText}`;
    console.error("API ERROR:", res.status, res.statusText, text);
    throw new Error(errMsg);
  }

  return res.json();
};
