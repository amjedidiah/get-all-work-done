import { useCallback } from "react";
import useAuth from "@/hooks/use-auth";

export default function useAuthFetch() {
  const { getAuthHeaders } = useAuth();
  const headers = getAuthHeaders();

  const authFetch = useCallback(
    async <T>(
      input: string,
      init?: RequestInit,
      option?: {
        headers: Array<Record<string, string>>;
      }
    ) => {
      if (option?.headers && headers)
        option.headers.forEach(({ name, value }) =>
          headers.append(name, value)
        );

      const { data, message, error } = await fetch(input, {
        ...init,
        headers,
      }).then((res) => res.json());

      if (error) throw new Error(message);

      return data as T;
    },
    [headers]
  );

  return authFetch;
}
