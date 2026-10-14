import { api } from "#lib/api";
import { useMutation } from "@tanstack/react-query";

export type UploadResult = { videoId: string; jobId: number };

export function useUploadVideo() {
  return useMutation({
    mutationFn: async (body: FormData) => {
      const { data } = await api.post<UploadResult>("/videos/upload", body);
      return data;
    },
    retry: false,
  });
}
