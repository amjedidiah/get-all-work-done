import { useEffect, useState } from "react";
import User from "@/db/models/user";
import { useDebouncedCallback } from "use-debounce";
import useAuthFetch from "@/hooks/use-auth-fetch";
import useAuth from "@/hooks/use-auth";

export default function useGetUser() {
  const [user, setUser] = useState<User>();
  const { isAuthed, expireUserToken } = useAuth();
  const authFetch = useAuthFetch();

  const getUser = useDebouncedCallback(async () => {
    try {
      const data = await authFetch<{
        user: User;
      }>("/api/user");

      setUser(data.user);
    } catch (error) {
      expireUserToken();
      console.error(error);
    }
  }, 1000);

  useEffect(() => {
    if (isAuthed) getUser();
  }, [getUser, isAuthed]);

  return user;
}
