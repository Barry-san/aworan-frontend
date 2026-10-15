import type { ReactNode } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "#components/ui/card";

export default function AuthLayout({
	children,
	cta,
	description,
}: {
	children: ReactNode;
	cta: ReactNode;
	description: ReactNode;
}) {
	return (
		<div className="grid place-items-center min-h-screen">
			<Card className="w-full max-w-120 pt-6 pb-10 md:pb-20 px-5 gap-10">
				<CardHeader>
					<CardTitle>
						<h1 className="text-xl md:text-2xl tracking-wider lowercase font-semibold">
							Aworan<span className="text-primary">.</span>
						</h1>
					</CardTitle>
					<CardAction className="self-center text-xs text-neutral-400">
						{cta}
					</CardAction>
				</CardHeader>
				<CardContent>
					<h2 className="font-semibold text-3xl mb-5 capitalize">
						{description}
					</h2>
					{children}
				</CardContent>
			</Card>
		</div>
	);
}
