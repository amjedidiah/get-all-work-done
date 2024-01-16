"use client";
import OnboardingForm from "@/components/onboarding-form";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Onboarding() {
  const router = useRouter();
  const { isAuthed } = useAuth();

  useEffect(() => {
    if (!isAuthed) router.push("/");
  }, [isAuthed, router]);

  return <OnboardingForm />;
}
