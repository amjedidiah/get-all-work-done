import { useCallback } from "react";
import { RPCError, RPCErrorCode } from "magic-sdk";
import { magicPublishable as magic } from "@/lib/magic";

export default function useLogin() {
  const handleLogin = useCallback(async (email: string) => {
    if (!magic) return;

    try {
      const didToken = await magic.auth.loginWithMagicLink({ email });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${didToken}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());
    } catch (error) {
      console.error(error);
      if (error instanceof RPCError)
        switch (error.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            throw new Error(error.message);
        }

      throw new Error("Something went wrong. Please try again.");
    }
  }, []);

  return handleLogin;
}
