import { fetchAPI } from "./api";

export const getCategories = async () => {
  return await fetchAPI("/categories");
};
