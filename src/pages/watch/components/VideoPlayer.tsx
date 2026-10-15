import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Maximize, Minimize, RotateCcw } from "lucide-react";

type Quality = { index: number; height: number };

export default function VideoPlayer({
	src,
	title,
}: {
	src: string;
	title: string;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const hlsRef = useRef<Hls | null>(null);
	const [qualities, setQualities] = useState<Quality[]>([]);
	const [quality, setQuality] = useState(-1);
	const [error, setError] = useState("");
	const [attempt, setAttempt] = useState(0);
	const [fullscreen, setFullscreen] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		let active = true;
		let hls: Hls | null = null;
		if (Hls.isSupported()) {
			hls = new Hls();
			hlsRef.current = hls;
			hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
				if (active)
					setQualities(
						data.levels
							.map((level, index) => ({ index, height: level.height }))
							.sort((a, b) => b.height - a.height),
					);
			});
			hls.on(Hls.Events.ERROR, (_, data) => {
				if (active && data.fatal)
					setError(
						"Could not play this video. Check your connection and try again.",
					);
			});
			hls.loadSource(src);
			hls.attachMedia(video);
		} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
			video.src = src;
		} else {
			// Report asynchronously so the error follows the same event flow as media failures.
			queueMicrotask(() => {
				if (active)
					setError("This browser does not support this video format.");
			});
		}
		return () => {
			active = false;
			hls?.destroy();
			hlsRef.current = null;
			video.removeAttribute("src");
			video.load();
		};
	}, [src, attempt]);

	useEffect(() => {
		const onFullscreenChange = () =>
			setFullscreen(document.fullscreenElement === containerRef.current);
		document.addEventListener("fullscreenchange", onFullscreenChange);
		return () =>
			document.removeEventListener("fullscreenchange", onFullscreenChange);
	}, []);

	async function toggleFullscreen() {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else if (containerRef.current?.requestFullscreen)
				await containerRef.current.requestFullscreen();
			else {
				const video = videoRef.current as
					| (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
					| null;
				video?.webkitEnterFullscreen?.();
			}
		} catch {
			setError(
				"Fullscreen could not be opened. You can also use the video’s fullscreen control.",
			);
		}
	}

	function retry() {
		setError("");
		setQualities([]);
		setQuality(-1);
		setAttempt((current) => current + 1);
	}

	return (
		<div
			ref={containerRef}
			className="flex w-full flex-col overflow-hidden rounded-xl bg-black text-white shadow-xl fullscreen:h-screen fullscreen:justify-center fullscreen:rounded-none"
		>
			<div className="relative flex min-h-0 flex-1 items-center justify-center">
				<video
					ref={videoRef}
					controls
					playsInline
					preload="metadata"
					aria-label={title}
					className="aspect-video max-h-[70dvh] w-full object-contain fullscreen:max-h-none"
					onError={() =>
						setError("Could not load this video. Please try again.")
					}
				/>
				{error && (
					<div
						role="alert"
						className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 p-6 text-center"
					>
						<p className="max-w-md text-sm">{error}</p>
						<button
							type="button"
							onClick={retry}
							className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm focus-visible:outline-2"
						>
							<RotateCcw className="size-4" /> Try again
						</button>
					</div>
				)}
			</div>
			<div className="flex flex-wrap items-center justify-end gap-4 border-t border-white/10 bg-neutral-950 px-4 py-3 text-xs">
				<label className="flex items-center gap-2" htmlFor="playback-quality">
					Quality
					<select
						id="playback-quality"
						value={quality}
						disabled={!qualities.length}
						onChange={(event) => {
							const next = Number(event.target.value);
							if (hlsRef.current) hlsRef.current.currentLevel = next;
							setQuality(next);
						}}
						className="rounded-md border border-white/20 bg-neutral-900 px-2 py-1.5 text-white focus-visible:outline-2 disabled:opacity-60"
					>
						<option value={-1}>Auto</option>
						{qualities.map((level) => (
							<option key={level.index} value={level.index}>
								{level.height}p
							</option>
						))}
					</select>
				</label>
				<button
					type="button"
					onClick={() => void toggleFullscreen()}
					aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
					className="rounded-md p-2 hover:bg-white/10 focus-visible:outline-2"
				>
					{fullscreen ? (
						<Minimize className="size-5" />
					) : (
						<Maximize className="size-5" />
					)}
				</button>
			</div>
		</div>
	);
}
