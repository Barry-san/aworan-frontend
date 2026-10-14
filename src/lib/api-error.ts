import { isAxiosError } from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return "Your session expired. Please sign in again.";
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (error.response) return `Request failed (${error.response.status}). Please try again.`;
    return fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
