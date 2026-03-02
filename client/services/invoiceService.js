import { fetchAPI } from "./api";

export const createInvoice = async (payload) => {
  return await fetchAPI(`/invoices`, { method: "POST", body: JSON.stringify(payload) });
};

export const getInvoices = async () => {
  return await fetchAPI(`/invoices`);
};

export const getInvoiceById = async (id) => {
  return await fetchAPI(`/invoices/${id}`);
};
