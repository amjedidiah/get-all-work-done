"use client";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const { isAuthed, expireUserToken } = useAuth();

  useEffect(() => {
    if (isAuthed) expireUserToken();

    router.push("/");
  }, [expireUserToken, isAuthed, router]);

  return (
    <section>
      <article className="container mx-auto px-4 lg:px-8">
        <p>Logging you out...</p>
      </article>
    </section>
  );
}
