import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "#lib/auth";

type LoginParams = {
	email: string;
	password: string;
};

export function useLogin() {
	return useMutation({
		mutationFn: (credentials: LoginParams) =>
			authClient.signIn.email(credentials, {
				onSuccess: () => {
					toast.success("Logged in!");
				},
				// onError: (e) => { toast.error(e.response.json()) }
			}),
	});
}
