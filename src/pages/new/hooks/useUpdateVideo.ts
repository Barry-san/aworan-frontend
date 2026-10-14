import { api } from "#lib/api";
import { useMutation } from "@tanstack/react-query";

type UpdateVideoParams = {
  videoId: string;
  title: string;
  description: string;
};

export function useUpdateVideo() {
  return useMutation({
    mutationFn: async ({ videoId, title, description }: UpdateVideoParams) => {
      await api.patch(`/videos/${videoId}`, { title, description });
    },
    retry: false,
  });
}
