import { fetchAPI } from "./api";

export const getProducts = async () => {
  return await fetchAPI("/products");
};

export const getProductById = async (id) => {
  return await fetchAPI(`/products/${id}`);
};
