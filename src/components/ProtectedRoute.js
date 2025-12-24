import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${router.pathname}`);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  return children;
}
