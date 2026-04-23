
import { fetchAPI } from "./api";

// Get all categories or by parent
export const getCategories = async (parent = undefined) => {
  let url = "/categories";
  if (parent !== undefined) url += `?parent=${parent}`;
  return await fetchAPI(url);
};

// Get single category (with children)
export const getCategoryById = async (id) => {
  return await fetchAPI(`/categories/${id}`);
};

// Create category (optionally with parent)
export const createCategory = async (name, parent = null) => {
  return await fetchAPI("/categories", {
    method: "POST",
    body: JSON.stringify({ name, parent }),
    headers: { "Content-Type": "application/json" },
  });
};

// Update category
export const updateCategory = async (id, name, parent = null) => {
  return await fetchAPI(`/categories/${id}` , {
    method: "POST",
    body: JSON.stringify({ name, parent }),
    headers: { "Content-Type": "application/json" },
  });
};

// Delete category
export const deleteCategory = async (id) => {
  return await fetchAPI(`/categories/${id}`, { method: "DELETE" });
};
