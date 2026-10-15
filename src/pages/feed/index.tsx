import { useState } from "react";
import {
	ArrowLeft,
	ArrowRight,
	Play,
	Plus,
	RefreshCw,
	Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetFeed, type FeedVideo } from "#hooks/useGetFeed";
import { Button, buttonVariants } from "#components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#components/ui/card";
import { getApiErrorMessage } from "#lib/api-error";
import { ENV } from "#lib/env";
import AppLayout from "../../layouts/dashboardLayout";

const statusLabels: Record<FeedVideo["status"], string> = {
	pending: "Queued",
	processing: "Processing",
	ready: "Ready to watch",
	failed: "Processing failed",
};

function formatDuration(seconds: number) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainder = String(seconds % 60).padStart(2, "0");
	return hours
		? `${hours}:${String(minutes).padStart(2, "0")}:${remainder}`
		: `${minutes}:${remainder}`;
}

function VideoThumbnail({ video }: { video: FeedVideo }) {
	const [failedUrl, setFailedUrl] = useState<string | null>(null);
	const src = video.thumbnail_url
		? new URL(video.thumbnail_url, `${ENV.VITE_BASE_URL.replace(/\/$/, "")}/`)
				.href
		: null;

	return (
		<div className="relative flex aspect-video items-center justify-center overflow-hidden bg-muted">
			{src && failedUrl !== src ? (
				<img
					src={src}
					alt=""
					loading="lazy"
					decoding="async"
					width={640}
					height={360}
					className="h-full w-full object-cover"
					onError={() => setFailedUrl(src)}
				/>
			) : (
				<div className="flex flex-col items-center gap-2 text-muted-foreground">
					<Video aria-hidden className="size-8" />
					<span className="text-xs">
						{src ? "Preview unavailable" : "No thumbnail yet"}
					</span>
				</div>
			)}
			{video.duration_seconds !== null && (
				<span className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-xs text-white">
					{formatDuration(video.duration_seconds)}
				</span>
			)}
		</div>
	);
}

function VideoCard({ video }: { video: FeedVideo }) {
	const canWatch = video.status === "ready" && !!video.stream_url;
	const date = new Date(video.created_at);

	return (
		<Card className="h-full gap-4 pt-0">
			{canWatch ? (
				<Link
					to={`/watch/${video.video_id}`}
					aria-label={`Watch ${video.title}`}
					className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
				>
					<VideoThumbnail video={video} />
				</Link>
			) : (
				<VideoThumbnail video={video} />
			)}
			<CardHeader className="gap-4">
				<div className="flex items-center justify-between gap-3">
					<Video aria-hidden className="size-5 text-primary" />
					<span
						className={`rounded-full px-2.5 py-1 text-xs ${video.status === "ready" ? "bg-primary/10 text-primary" : video.status === "failed" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}
					>
						{statusLabels[video.status]}
					</span>
				</div>
				<CardTitle>
					<h2 className="wrap-break-word text-lg font-semibold">
						{canWatch ? (
							<Link
								to={`/watch/${video.video_id}`}
								className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
							>
								{video.title}
							</Link>
						) : (
							video.title
						)}
					</h2>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1">
				<p className="line-clamp-3 wrap-break-word text-sm leading-relaxed text-muted-foreground">
					{video.description || "No description added."}
				</p>
				<div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
					{!Number.isNaN(date.getTime()) && (
						<time dateTime={video.created_at}>
							{date.toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</time>
					)}
					{video.duration_seconds !== null && (
						<span>{formatDuration(video.duration_seconds)}</span>
					)}
					{video.source_height !== null && (
						<span>{video.source_height}p source</span>
					)}
				</div>
			</CardContent>
			<CardFooter className="justify-between gap-3">
				{canWatch ? (
					<Link
						to={`/watch/${video.video_id}`}
						className={buttonVariants({ variant: "ghost", size: "sm" })}
					>
						<Play aria-hidden /> Watch video <ArrowRight aria-hidden />
					</Link>
				) : (
					<p className="py-1 text-xs text-muted-foreground">
						{video.status === "failed"
							? "This video is unavailable."
							: video.status === "ready"
								? "Playback is unavailable."
								: "Getting this video ready to watch."}
					</p>
				)}
			</CardFooter>
		</Card>
	);
}

export default function FeedPage() {
	const [page, setPage] = useState(1);
	const {
		data: videos,
		isPending,
		isError,
		error,
		isFetching,
		refetch,
	} = useGetFeed(page);

	return (
		<AppLayout>
			<main className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-12">
				<div className="mb-8 flex flex-wrap items-end justify-between gap-5">
					<div>
						<p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
							The community feed
						</p>
						<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
							Something worth watching.
						</h1>
						<p className="mt-3 text-sm text-muted-foreground">
							Explore the latest videos shared on Aworan.
						</p>
					</div>
					<Link
						to="/new"
						className={buttonVariants({ size: "lg", className: "font-mono" })}
					>
						<Plus aria-hidden /> New video
					</Link>
				</div>
				<section aria-label="Video feed" aria-busy={isFetching}>
					<div className="mb-5 flex items-center justify-between gap-4">
						<h2 className="text-sm font-medium">Latest videos</h2>
						<Button
							variant="ghost"
							size="sm"
							disabled={isFetching}
							onClick={() => void refetch()}
						>
							<RefreshCw
								aria-hidden
								className={isFetching ? "animate-spin" : ""}
							/>{" "}
							Refresh
						</Button>
					</div>
					{isError && (
						<div
							role="alert"
							className="mb-6 rounded-xl border border-destructive/30 p-5"
						>
							<p className="text-sm text-destructive">
								{getApiErrorMessage(
									error,
									"Could not load the feed. Please try again.",
								)}
							</p>
							<Button
								variant="outline"
								className="mt-4"
								disabled={isFetching}
								onClick={() => void refetch()}
							>
								Try again
							</Button>
						</div>
					)}
					{isPending ? (
						<div role="status">
							<p className="sr-only">Loading videos…</p>
							<div
								aria-hidden
								className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
							>
								{Array.from({ length: 6 }, (_, index) => (
									<Card
										key={index}
										className="gap-4 pt-0 motion-safe:animate-pulse"
									>
										<div className="aspect-video bg-muted" />
										<div className="grid gap-4 px-5 pb-1">
											<div className="h-5 w-24 rounded bg-muted" />
											<div className="h-6 w-3/4 rounded bg-muted" />
											<div className="h-4 rounded bg-muted" />
											<div className="h-4 w-2/3 rounded bg-muted" />
											<div className="mt-5 h-8 w-28 rounded bg-muted" />
										</div>
									</Card>
								))}
							</div>
						</div>
					) : videos?.length ? (
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{videos.map((video) => (
								<VideoCard key={video.video_id} video={video} />
							))}
						</div>
					) : (
						!isError && (
							<div className="rounded-xl border border-dashed bg-muted/20 px-6 py-16 text-center">
								<Video
									aria-hidden
									className="mx-auto mb-5 size-9 text-primary"
								/>
								<h2 className="text-lg font-medium">
									{page === 1
										? "The first story could be yours."
										: "You’re all caught up."}
								</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									{page === 1
										? "Share a video to get the feed started."
										: "There are no more videos on this page."}
								</p>
								{page === 1 && (
									<Link
										to="/new"
										className={buttonVariants({ className: "mt-6" })}
									>
										<Plus aria-hidden /> Upload a video
									</Link>
								)}
							</div>
						)
					)}
					{(page > 1 || !!videos?.length) && (
						<nav
							aria-label="Feed pages"
							className="mt-8 flex items-center justify-between gap-4 border-t pt-5"
						>
							<Button
								variant="outline"
								disabled={page === 1 || isFetching}
								onClick={() => setPage((current) => current - 1)}
							>
								<ArrowLeft aria-hidden /> Previous
							</Button>
							<span
								aria-live="polite"
								className="text-xs text-muted-foreground"
							>
								Page {page}
							</span>
							<Button
								variant="outline"
								disabled={isFetching || isError || !videos?.length}
								onClick={() => setPage((current) => current + 1)}
							>
								Next <ArrowRight aria-hidden />
							</Button>
						</nav>
					)}
				</section>
			</main>
		</AppLayout>
	);
}
