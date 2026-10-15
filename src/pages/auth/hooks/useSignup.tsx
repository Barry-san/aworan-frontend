import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "#lib/auth";

export function useSignup() {
	return useMutation({
		mutationFn: (data: SignupParams) => signup(data),
		onSuccess: () => {
			toast.success("signup successful!");
		},
		onError: (e) => {
			toast.error("Invalid signup credentials.");
			console.log(e);
		},
	});
}

function signup({ email, password, username }: SignupParams) {
	return authClient.signUp.email({ name: username, password, email });
}

type SignupParams = {
	username: string;
	email: string;
	password: string;
};
