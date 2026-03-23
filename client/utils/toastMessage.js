import { toast } from "react-toastify";

export const toastMessage = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast.info(msg),
  warn: (msg) => toast.warn(msg),
};
