import { LoginFormValues } from "@/types";
import { useCallback, useState } from "react";
import useLogin from "@/hooks/use-login";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import useAuth from "@/hooks/use-auth";

const initialValues: LoginFormValues = {
  email: "",
};

export default function useLoginForm() {
  const { storeUserToken } = useAuth();
  const [formValues, setFormValues] = useState<LoginFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState("");
  const login = useLogin();
  const router = useRouter();

  const handleFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.currentTarget;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    },
    [formValues]
  );

  const handleFormSubmit = useDebouncedCallback(async () => {
    try {
      // 1. Magic Auth
      const resp = await login(formValues.email);
      console.info("Logged in successfully");

      // 2.Save Token
      if (!resp?.token) throw new Error("Invalid token");
      storeUserToken(resp.token);
      console.info("Token saved");

      // 3. Redirect to onboarding
      router.push("/onboarding");
    } catch (error: any) {
      setFormResponse(error?.message ?? "Something went wrong");
    } finally {
      setTimeout(() => {
        setFormResponse("");
      }, 5000);
    }
  }, 1500);

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleFormSubmit();
  };

  return {
    formSubmit,
    handleFormChange,
    formValues,
    formResponse,
  };
}
