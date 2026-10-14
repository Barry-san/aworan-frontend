import { api } from "#lib/api";
import { useQuery } from "@tanstack/react-query";

type VideoJob = {
  status: "pending" | "probing" | "transcoding" | "done" | "failed" | "cancelled";
  progress: number;
};

export function useVideoStatus(jobId?: number) {
  return useQuery({
    queryKey: ["video-processing", jobId],
    enabled: jobId !== undefined,
    queryFn: async ({ signal }) => {
      if (jobId === undefined) throw new Error("No processing job selected.");
      const { data } = await api.post<VideoJob>(`/videos/status/${jobId}`, undefined, { signal });
      return data;
    },
    refetchInterval: query => {
      if (query.state.status === "error") return false;
      if (query.state.data && ["done", "failed", "cancelled"].includes(query.state.data.status)) return false;
      return 3000;
    },
    retry: false,
  });
}
