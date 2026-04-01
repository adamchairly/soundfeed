import axios from "axios";

export const getApiErrorMessage = (err: unknown, fallback?: string): string => {
  if (!axios.isAxiosError(err)) return fallback ?? "Something went wrong";

  if (!err.response) return "Connection failed";

  if (err.response.status === 429) return "Too many requests, please try again later";

  const message = err.response.data?.message;
  if (typeof message === "string" && message.length > 0) return message;

  return fallback ?? "Something went wrong";
};
