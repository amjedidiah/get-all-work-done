import { useEffect } from "react";
import User from "@/db/models/user";
import useAuthFetch from "@/hooks/use-auth-fetch";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";

export default function useUser() {
  const { isAuthed } = useAuth();
  const authFetch = useAuthFetch();
  const fetcher = (url: string) => authFetch<{ user: User }>(url);
  const { data, error, isLoading } = useSWR(
    !isAuthed ? null : "/api/user",
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
  const user = data?.user;
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const handleUpdateUser = async (userUpdate: { dbUpdate: Partial<User> }) =>
    authFetch<{
      user: User;
    }>("/api/user", {
      method: "PATCH",
      body: JSON.stringify(userUpdate),
    }).then(() => mutate("/api/user"));

  useEffect(() => {
    if (!data?.user && !isLoading) router.push("/logout");
  }, [data?.user, error, isLoading, router]);

  console.log(error, data);

  return { user, handleUpdateUser };
}
