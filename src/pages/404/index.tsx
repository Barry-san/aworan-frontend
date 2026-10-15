import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "#components/ui/button";

export default function NotFoundPage() {
	return (
		<div className="w-full h-screen grid place-items-center">
			<header className="p-6 fixed top-0 w-full">
				<p className="font-semibold tracking-wider md:text-3xl lowercase">
					Aworan <span className="text-primary">.</span>
				</p>
			</header>

			<article className="text-center">
				<p className="font-bold text-[200px] tracking-wider">
					4<span className="text-primary">0</span>4
				</p>
				<p>The page you're looking for does not exist.</p>

				<Button variant={"link"}>
					{" "}
					<Link to="/">Go home</Link> <ArrowRight aria-hidden />
				</Button>
			</article>
		</div>
	);
}
