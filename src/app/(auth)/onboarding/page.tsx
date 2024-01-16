"use client";
import OnboardingForm from "@/components/onboarding-form";
import useAuth from "@/hooks/use-auth";
import useUser from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Onboarding() {
  const router = useRouter();
  const { isAuthed } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isAuthed) router.push("/login");
    if (user?.isOnboarded) router.push("/dashboard");
  }, [isAuthed, router, user?.isOnboarded]);

  return <OnboardingForm />;
}
