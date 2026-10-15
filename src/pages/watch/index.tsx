import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "#components/ui/button";
import { getApiErrorMessage } from "#lib/api-error";
import { ENV } from "#lib/env";
import AppLayout from "../../layouts/dashboardLayout";
import VideoPlayer from "./components/VideoPlayer";
import { useWatchVideo } from "./hooks/useWatchVideo";

export default function WatchVideoPage() {
	const { videoId } = useParams();
	const {
		data: video,
		isPending,
		isError,
		error,
		refetch,
		isFetching,
	} = useWatchVideo(videoId);

	return (
		<AppLayout>
			<main className="mx-auto flex min-h-[calc(100dvh-88px)] max-w-6xl flex-col justify-center px-4 py-8 md:px-6">
				<Link
					to="/"
					className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" /> Back to feed
				</Link>
				{isPending ? (
					<div
						role="status"
						className="flex aspect-video items-center justify-center rounded-xl bg-muted"
					>
						<LoaderCircle aria-hidden className="mr-2 size-5 animate-spin" />{" "}
						Loading video…
					</div>
				) : isError ? (
					<div role="alert" className="rounded-xl border p-8 text-center">
						<p className="text-sm text-destructive">
							{getApiErrorMessage(error, "Could not load this video.")}
						</p>
						<Button
							className="mt-4"
							variant="outline"
							disabled={isFetching}
							onClick={() => void refetch()}
						>
							Try again
						</Button>
					</div>
				) : !video ? (
					<div className="rounded-xl border p-12 text-center">
						<h1 className="text-xl font-semibold">Video not found</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							This video may have been removed.
						</p>
					</div>
				) : (
					<>
						{video.status === "ready" && video.stream_url ? (
							<VideoPlayer
								key={video.stream_url}
								src={
									new URL(
										video.stream_url,
										`${ENV.VITE_BASE_URL.replace(/\/$/, "")}/`,
									).href
								}
								title={video.title}
							/>
						) : (
							<div className="flex aspect-video flex-col items-center justify-center rounded-xl bg-muted p-6 text-center">
								<p className="text-lg font-medium">
									{video.status === "failed"
										? "This video is unavailable"
										: "This video isn’t ready yet"}
								</p>
								<p className="mt-2 text-sm text-muted-foreground">
									{video.status === "failed"
										? "The video could not be processed."
										: "Check back once processing has finished."}
								</p>
								<Button
									variant="outline"
									className="mt-4"
									disabled={isFetching}
									onClick={() => void refetch()}
								>
									Check again
								</Button>
							</div>
						)}
						<div className="mt-6">
							<h1 className="break-words text-2xl font-semibold tracking-tight">
								{video.title}
							</h1>
							{video.description && (
								<p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
									{video.description}
								</p>
							)}
						</div>
					</>
				)}
			</main>
		</AppLayout>
	);
}
