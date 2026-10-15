import { api } from "#lib/api";
import { useQuery } from "@tanstack/react-query";

export type FeedVideo = {
	video_id: string;
	title: string;
	description: string | null;
	status: "pending" | "processing" | "ready" | "failed";
	duration_seconds: number | null;
	source_height: number | null;
	created_at: string;
	stream_url: string | null;
	thumbnail_url: string | null;
};

export function useGetFeed(page = 1) {
	return useQuery({
		queryKey: ["getVideos", page],
		queryFn: async ({ signal }) => {
			const { data } = await api.get<FeedVideo[]>("/videos", {
				params: { page },
				signal,
			});
			return data;
		},
	});
}
