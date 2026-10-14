import { useQuery } from "@tanstack/react-query";
import { api } from "#lib/api";
import type { FeedVideo } from "#hooks/useGetFeed";

export function useWatchVideo(videoId?: string) {
  return useQuery({
    queryKey: ["watch-video", videoId],
    enabled: !!videoId,
    queryFn: async ({ signal }) => {
      // The API currently exposes video details through the paginated feed only.
      for (let page = 1; ; page++) {
        const { data } = await api.get<FeedVideo[]>("/videos", { params: { page }, signal });
        const video = data.find(item => item.video_id === videoId);
        if (video) return video;
        if (!data.length) return null;
      }
    },
    retry: false,
  });
}
