import { ArrowRight, Eye, EyeOff, Lock, Mail, User2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { ERROR_MESSAGES } from "#lib/contants";
import AuthLayout from "../../../layouts/authLayout";
import FormError from "../components/form-error";
import { useSignup } from "../hooks/useSignup";

export default function RegisterPage() {
	return (
		<AuthLayout cta={<SignupCTA />} description={"Create Account"}>
			<SignupForm></SignupForm>
		</AuthLayout>
	);
}

function SignupForm() {
	const { register, handleSubmit, formState } = useForm<{
		username: string;
		email: string;
		password: string;
		confirm_password: string;
	}>();
	const { errors } = formState;
	const { mutate: handleSignup } = useSignup();
	const [isVisible, setVisibility] = useState(false);

	return (
		<form
			className="grid gap-8"
			onSubmit={handleSubmit((data) => handleSignup(data))}
		>
			<div className="grid gap-2">
				<label htmlFor="username" className="text-neutral-200 text-sm">
					username
				</label>
				<div className="relative">
					<User2
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
					/>
					<Input
						id="username"
						type="text"
						placeholder="yourname"
						className="pl-9"
						{...register("username", {
							required: ERROR_MESSAGES.required_field,
							minLength: { value: 3, message: "Minimum of 3 characters" },
							maxLength: { value: 50, message: "Maximum of 50 characters" },
						})}
					/>
				</div>
				<FormError error={errors.username?.message} />
			</div>

			<div className="grid gap-2">
				<label htmlFor="email" className="text-neutral-200 text-sm relative">
					email
				</label>
				<div className="relative">
					<Mail
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
					/>
					<Input
						type="email"
						placeholder="example@email.com"
						className="pl-9"
						{...register("email", {
							required: ERROR_MESSAGES.required_field,
						})}
					/>
				</div>
			</div>

			<div className="grid gap-2">
				<label htmlFor="password" className="text-neutral-200 text-sm">
					password
				</label>
				<div className="relative">
					<Lock
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/4 size-4 text-neutral-400"
					/>
					<Input
						type={isVisible ? "text" : "password"}
						placeholder="enter your password"
						className="pl-9"
						{...register("password", {
							required: ERROR_MESSAGES.required_field,
							minLength: { value: 6, message: "Minimum length of 6" },
						})}
					/>

					<button
						className={
							"absolute right-3 flex items-center top-1/4 text-neutral-400"
						}
						onClick={() => setVisibility(() => !isVisible)}
						type="button"
						aria-label={isVisible ? "Hide password" : "Show password"}
					>
						{isVisible ? (
							<EyeOff className="pointer-events-none size-4" />
						) : (
							<Eye className="pointer-events-none size-4" />
						)}
					</button>
				</div>
			</div>

			<div className="grid gap-2">
				<label htmlFor="confirm_password" className="text-neutral-200 text-sm">
					password
				</label>
				<div className="relative">
					<Lock
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/4 size-4 text-neutral-400"
					/>
					<Input
						type={isVisible ? "text" : "password"}
						required
						placeholder="enter your password"
						className="pl-9"
						{...register("confirm_password", {
							validate: (value, values) =>
								value === values.password || "passwords don't match",
							required: "Please confirm your password",
						})}
					/>
					<button
						className={
							"absolute right-3 flex items-center top-1/4 text-neutral-400"
						}
						onClick={() => setVisibility(() => !isVisible)}
						type="button"
						aria-label={isVisible ? "Hide password" : "Show password"}
					>
						{isVisible ? (
							<EyeOff className="pointer-events-none size-4" />
						) : (
							<Eye className="pointer-events-none size-4" />
						)}
					</button>
				</div>
			</div>

			<Button type="submit" className="py-5 text-sm capitalize font-mono">
				Sign in <ArrowRight />
			</Button>
		</form>
	);
}

function SignupCTA() {
	return (
		<p className="text-sm text-neutral-400">
			Already have an account?{" "}
			<Link to={"/login"} className="text-primary">
				Log in
			</Link>
		</p>
	);
}
