
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { status, refetch } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <p>Checking session…</p>;
  }

  if (status === "error") {
    return (
      <button type="button" onClick={() => void refetch()}>
        Could not check your session. Retry
      </button>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search + location.hash,
        }}
      />
    );
  }

  return <Outlet />;
}
