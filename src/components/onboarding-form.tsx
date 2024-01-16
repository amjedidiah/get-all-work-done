"use client";
import useOnboarding from "@/hooks/use-onboarding";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

export default function OnboardingForm() {
  const { stripeConnectInstance, updateIsOnboarded } = useOnboarding();

  if (!stripeConnectInstance) return <div>Loading...</div>;

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectAccountOnboarding
        onExit={updateIsOnboarded}
        fullTermsOfServiceUrl=""
        privacyPolicyUrl=""
        recipientTermsOfServiceUrl=""
      />
    </ConnectComponentsProvider>
  );
}
