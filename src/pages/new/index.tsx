import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ArrowLeft, Check, Film, LoaderCircle, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Input } from "#components/ui/input";
import AppLayout from "../../layouts/dashboardLayout";
import { getApiErrorMessage } from "#lib/api-error";
import { useUploadVideo, type UploadResult } from "./hooks/useUploadVideo";
import { useUpdateVideo } from "./hooks/useUpdateVideo";
import { useVideoStatus } from "./hooks/useVideoStatus";

const MAX_BYTES = 300 * 1024 * 1024;
type VideoFormValues = { title: string; description: string };

export default function NewVideoPage() {
	const submitting = useRef(false);
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState("");
	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<VideoFormValues>({
		defaultValues: { title: "", description: "" },
	});
	const [title, description] = useWatch({
		control,
		name: ["title", "description"],
	});
	const [dragging, setDragging] = useState(false);
	const [error, setError] = useState("");
	const [uploaded, setUploaded] = useState<UploadResult | null>(null);
	const [detailsSaved, setDetailsSaved] = useState(false);

	useEffect(() => {
		if (!preview) return;
		return () => URL.revokeObjectURL(preview);
	}, [preview]);

	const { mutateAsync: uploadVideo } = useUploadVideo();
	const { mutateAsync: updateVideo } = useUpdateVideo();
	const job = useVideoStatus(uploaded?.jobId);

	function chooseFile(next?: File) {
		if (!next || isSubmitting || uploaded) return;
		if (!next.type.startsWith("video/")) {
			setError("Please select a video file.");
			return;
		}
		if (!next.size || next.size > MAX_BYTES) {
			setError("Choose a non-empty video up to 300 MB.");
			return;
		}
		setFile(next);
		setPreview(URL.createObjectURL(next));
		setValue("title", next.name.replace(/\.[^.]+$/, "").slice(0, 200), {
			shouldDirty: true,
			shouldValidate: true,
		});
		setError("");
	}

	async function upload(values: VideoFormValues) {
		if (!file || detailsSaved || submitting.current) return;
		submitting.current = true;
		setError("");
		try {
			let result = uploaded;
			if (!result) {
				const body = new FormData();
				body.append("video", file);
				result = await uploadVideo(body);
				setUploaded(result);
			}
			await updateVideo({
				videoId: result.videoId,
				title: values.title.trim(),
				description: values.description,
			});
			setDetailsSaved(true);
		} catch (cause) {
			setError(
				getApiErrorMessage(
					cause,
					"Could not upload your video. Please try again.",
				),
			);
		} finally {
			submitting.current = false;
		}
	}

	const finished = job.data?.status === "done";
	const failed =
		job.data?.status === "failed" || job.data?.status === "cancelled";

	return (
		<AppLayout>
			<main className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-12">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" /> Back to feed
				</Link>
				<div className="mb-8 mt-6 flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
							Your next story
						</p>
						<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
							New video
						</h1>
						<p className="mt-3 text-sm text-muted-foreground">
							Share something worth watching.
						</p>
					</div>
					<span className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
						{uploaded ? "Video uploaded" : "New upload"}
					</span>
				</div>
				<form
					noValidate
					onSubmit={(event) => void handleSubmit(upload)(event)}
					className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
				>
					<div className="grid gap-6">
						<Card className="gap-5 p-2 md:p-4">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									<span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-mono text-xs text-primary">
										01
									</span>{" "}
									Video file
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div
									onDragOver={(event) => {
										event.preventDefault();
										if (!isSubmitting && !uploaded) setDragging(true);
									}}
									onDragLeave={() => setDragging(false)}
									onDrop={(event) => {
										event.preventDefault();
										setDragging(false);
										chooseFile(event.dataTransfer.files[0]);
									}}
									className={`rounded-xl border border-dashed p-6 text-center transition-colors md:p-10 ${dragging ? "border-primary bg-primary/10" : "border-border bg-muted/30"}`}
								>
									<div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
										<Upload className="size-6" />
									</div>
									<h2 className="text-lg font-medium">
										{file ? "Your video is selected" : "Drop your video here"}
									</h2>
									<p className="mb-5 mt-2 text-sm text-muted-foreground">
										{file
											? "Review the preview and add your details below."
											: "Or choose a file from your device to get started."}
									</p>
									<input
										id="video-file"
										type="file"
										accept="video/*"
										className="sr-only peer"
										aria-label="Select a video"
										disabled={isSubmitting || !!uploaded}
										onChange={(event) => {
											chooseFile(event.target.files?.[0]);
											event.target.value = "";
										}}
									/>
									<label
										htmlFor="video-file"
										className={buttonVariants({
											variant: file ? "outline" : "default",
											size: "lg",
											className:
												"cursor-pointer peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 peer-disabled:pointer-events-none peer-disabled:opacity-50",
										})}
									>
										{file ? "Change file" : "Choose video"}
									</label>
									<p className="mt-4 text-xs text-muted-foreground">
										One video at a time · Up to 300 MB
									</p>
								</div>
								{file && (
									<div className="mt-4 flex items-center gap-3 rounded-lg border p-3">
										<Film className="size-5 shrink-0 text-primary" />
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium">
												{file.name}
											</p>
											<p className="mt-1 text-xs text-muted-foreground">
												{(file.size / 1024 / 1024).toFixed(1)} MB
											</p>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											aria-label="Remove selected video"
											disabled={isSubmitting || !!uploaded}
											onClick={() => {
												setFile(null);
												setPreview("");
											}}
										>
											<X />
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
						<Card className="gap-5 p-2 md:p-4">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									<span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-mono text-xs text-primary">
										02
									</span>{" "}
									Video details
								</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-5">
								<div className="grid gap-2">
									<label htmlFor="video-title" className="text-sm font-medium">
										Title{" "}
										<span className="text-muted-foreground">(required)</span>
									</label>
									<Input
										id="video-title"
										maxLength={200}
										readOnly={isSubmitting || detailsSaved}
										aria-invalid={!!errors.title}
										aria-describedby={
											errors.title ? "video-title-error" : undefined
										}
										{...register("title", {
											validate: (value) =>
												!!value.trim() || "Please enter a title",
											maxLength: {
												value: 200,
												message: "Use 200 characters or fewer",
											},
										})}
										placeholder="Give your video a title"
										className="h-11"
									/>
									<p className="text-right text-xs text-muted-foreground">
										{title.length}/200
									</p>
									{errors.title && (
										<p
											id="video-title-error"
											role="alert"
											className="text-sm text-destructive"
										>
											{errors.title.message}
										</p>
									)}
								</div>
								<div className="grid gap-2">
									<label
										htmlFor="video-description"
										className="text-sm font-medium"
									>
										Description{" "}
										<span className="text-muted-foreground">(optional)</span>
									</label>
									<textarea
										id="video-description"
										maxLength={500}
										readOnly={isSubmitting || detailsSaved}
										aria-invalid={!!errors.description}
										aria-describedby={
											errors.description ? "video-description-error" : undefined
										}
										{...register("description", {
											maxLength: {
												value: 500,
												message: "Use 500 characters or fewer",
											},
										})}
										placeholder="Tell viewers a little about your video…"
										className="min-h-32 w-full resize-y rounded-lg border border-input bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
									/>
									<p className="text-right text-xs text-muted-foreground">
										{description.length}/500
									</p>
									{errors.description && (
										<p
											id="video-description-error"
											role="alert"
											className="text-sm text-destructive"
										>
											{errors.description.message}
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
					<aside className="grid gap-5 lg:sticky lg:top-24">
						<Card className="gap-4">
							<CardHeader>
								<CardTitle>Preview</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted">
									{file && preview ? (
										<video
											key={preview}
											src={preview}
											controls
											preload="metadata"
											className="h-full w-full object-contain"
										/>
									) : (
										<Film className="size-8 text-muted-foreground" />
									)}
								</div>
								<p className="mt-4 break-words text-sm font-medium">
									{title.trim() || "Your video title"}
								</p>
								<p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground">
									{description || "Your description will appear here."}
								</p>
							</CardContent>
						</Card>
						<div className="rounded-xl border p-5">
							<h2 className="text-sm font-medium">Ready when you are</h2>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
								Your video will be processed after upload. Keep this page open
								while your file is being sent.
							</p>
						</div>
						{uploaded && (
							<div aria-live="polite" className="rounded-xl border p-4 text-sm">
								<p className="flex items-center gap-2 font-medium">
									{finished && <Check className="size-4 text-primary" />}
									{finished
										? "Video ready"
										: failed
											? "Processing unsuccessful"
											: "Processing video"}
								</p>
								{job.data && (
									<progress
										aria-label="Video processing progress"
										max={100}
										value={Math.max(0, Math.min(100, job.data.progress))}
										className="mt-3 h-2 w-full accent-primary"
									/>
								)}
								{job.isError && (
									<button
										type="button"
										onClick={() => void job.refetch()}
										className="mt-2 text-primary underline"
									>
										Could not check processing. Retry
									</button>
								)}
								{!detailsSaved && (
									<p className="mt-2 text-xs text-muted-foreground">
										File received. Video details still need to be saved.
									</p>
								)}
							</div>
						)}
						{error && (
							<p role="alert" className="text-sm text-destructive">
								{error}
							</p>
						)}
						<Button
							type="submit"
							size="lg"
							className="h-11 w-full font-mono"
							disabled={!file || !title.trim() || isSubmitting || detailsSaved}
						>
							{isSubmitting ? (
								<>
									<LoaderCircle className="animate-spin" />
									{uploaded ? "Saving details…" : "Uploading…"}
								</>
							) : detailsSaved ? (
								<>
									<Check /> Uploaded
								</>
							) : uploaded ? (
								"Retry saving details"
							) : (
								<>
									<Upload /> Upload video
								</>
							)}
						</Button>
					</aside>
				</form>
			</main>
		</AppLayout>
	);
}
