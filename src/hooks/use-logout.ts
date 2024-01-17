import { useCallback, useEffect } from "react";
import useAuthFetch from "@/hooks/use-auth-fetch";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import useConnectInstance from "@/hooks/use-connect-instance";

export default function useLogout() {
  const router = useRouter();
  const { expireUserToken } = useAuth();
  const authFetch = useAuthFetch();
  const stripeConnectInstance = useConnectInstance();

  const handleLogout = useCallback(
    async () =>
      authFetch<null>("/api/auth/logout")
        .catch(console.error)
        .finally(async () => {
          if (stripeConnectInstance) await stripeConnectInstance.logout();
          expireUserToken();
          router.push("/");
        }),
    [authFetch, expireUserToken, router, stripeConnectInstance]
  );

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);
}
