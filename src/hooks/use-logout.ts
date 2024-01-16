import { useCallback, useEffect } from "react";
import useAuthFetch from "@/hooks/use-auth-fetch";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function useLogout() {
  const router = useRouter();
  const { expireUserToken, isAuthed } = useAuth();
  const authFetch = useAuthFetch();

  const handleLogout = useCallback(async () => {
    await authFetch<null>("/api/auth/logout");
  }, [authFetch]);

  useEffect(() => {
    if (isAuthed)
      handleLogout()
        .catch(console.error)
        .finally(() => {
          expireUserToken();
          router.push("/");
        });
  }, [expireUserToken, handleLogout, isAuthed, router]);
}
