import { BusinessTypeEnum, RegisterFormValues } from "@/types";
import useToken from "@/hooks/use-token";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  extractDOB,
  getIsIndividual,
  validateBusinessType,
  validateDOB,
  validateName,
} from "@/utils";
import useLogin from "@/hooks/use-login";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import useAuthFetch from "@/hooks/use-auth-fetch";
import useAuth from "@/hooks/use-auth";

const initialValues: RegisterFormValues = {
  email: "",
  dob_string: "",
  business_type: BusinessTypeEnum.individual,
  company_name: "",
};

const formatValues = ({ dob_string, ...rest }: RegisterFormValues) => {
  const dob = extractDOB(dob_string);

  return { ...rest, dob };
};

const validateEmailClient = (email: string) => {
  const isValidByRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      email
    );
  if (!isValidByRegex) throw new Error("Invalid email");
};

const getCompany = (company_name?: string) =>
  company_name
    ? {
        name: company_name,
      }
    : undefined;

export default function useRegisterForm() {
  const authFetch = useAuthFetch();
  const { storeUserToken } = useAuth();
  const { generateBusinessToken } = useToken();
  const [formValues, setFormValues] =
    useState<RegisterFormValues>(initialValues);
  const [formResponse, setFormResponse] = useState("");
  const isIndividual = useMemo(
    () => getIsIndividual(formValues.business_type),
    [formValues.business_type]
  );
  const login = useLogin();
  const router = useRouter();

  const handleFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // 1. Format values
      const { business_type, company_name, ...person } =
        formatValues(formValues);
      const company = getCompany(company_name);

      // 2. Validations
      validateEmailClient(person.email);
      validateDOB(person.dob);
      validateBusinessType(business_type);
      if (!isIndividual) validateName("Company Name", company_name);

      // 3. Generate token(s)
      const tokens = await generateBusinessToken(
        business_type,
        person,
        company
      );
      console.info("Tokens generated: ", tokens);

      // 4. Magic Auth
      const resp = await login(person.email);
      console.info("Logged in successfully");

      // 5.Save Token
      if (!resp?.token) throw new Error("Invalid token");
      storeUserToken(resp.token);
      console.info("Token saved");

      // 5. Create account
      const data = await authFetch(
        "/api/stripe/account",
        {
          method: "POST",
          body: JSON.stringify({ email: person.email }),
        },
        {
          headers: [
            { name: "account-token", value: tokens.account_token! },
            { name: "person-token", value: tokens.person_token! },
          ],
        }
      );
      console.info("Account created: ", data);

      // 6. Redirect to onboarding
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

  useEffect(() => {
    if (isIndividual)
      setFormValues((prev) => ({
        ...prev,
        company_name: "",
      }));
  }, [isIndividual]);

  return {
    formSubmit,
    handleFormChange,
    formValues,
    formResponse,
    isIndividual,
  };
}
