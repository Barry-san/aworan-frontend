import { authClient } from "#lib/auth";

export function useAuth() {
  const { data, isPending, error, refetch } = authClient.useSession()

  const status = isPending ?
    "loading" : error ?
      "error" : data ?
        "authenticated" : "unauthenticated"

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    status,
    refetch
  }
}
