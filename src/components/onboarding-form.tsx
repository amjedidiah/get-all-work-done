"use client";
import useConnectInstance from "@/hooks/use-connect-instance";
import useUser from "@/hooks/use-user";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

export default function OnboardingForm() {
  const stripeConnectInstance = useConnectInstance();
  const { handleUpdateUser } = useUser();

  const updateIsOnboarded = () =>
    handleUpdateUser({
      dbUpdate: {
        isOnboarded: true,
      },
    });

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
