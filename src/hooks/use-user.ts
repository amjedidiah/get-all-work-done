import { useEffect } from "react";
import useAuthFetch from "@/hooks/use-auth-fetch";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import { StripeAccount, User } from "@/types";

export default function useUser() {
  const authFetch = useAuthFetch();
  const fetcher = (url: string) =>
    authFetch<{ user: User; account: StripeAccount }>(url);
  const { data, error, isLoading } = useSWR("/account", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
  const user = data?.user;
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const handleUpdateUser = async (userUpdate: { dbUpdate: Partial<User> }) =>
    authFetch<{
      user: User;
    }>("/account", {
      method: "PATCH",
      body: JSON.stringify(userUpdate),
    }).then(() => mutate("/account"));

  useEffect(() => {
    if (!data?.user && !isLoading) router.push("/logout");
  }, [data?.user, error, isLoading, router]);

  return { user: { ...user, account: data?.account }, handleUpdateUser };
}
