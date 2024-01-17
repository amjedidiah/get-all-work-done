import {
  AccountTypeObject,
  Individual,
  BusinessType,
  Company,
  ExternalAccountObject,
  ExternalAccount,
} from "@/types";
import { getAccountType, getIsIndividual, validateBusinessType } from "@/utils";
import { useStripe } from "@stripe/react-stripe-js";
import { useCallback } from "react";

export default function useToken() {
  const stripe = useStripe();

  const generateAccountToken = useCallback(
    async (
      business_type: BusinessType,
      account_type_object: AccountTypeObject
    ) => {
      if (!stripe) throw new Error("An error occurred. Try again...");

      validateBusinessType(business_type);
      const account_type = getAccountType(business_type);

      const accountRes = await stripe.createToken("account", {
        business_type,
        tos_shown_and_accepted: true,
        [account_type]: account_type_object,
      });

      if (accountRes.error) throw new Error(accountRes.error.message);

      return accountRes.token?.id;
    },
    [stripe]
  );

  const generatePersonToken = useCallback(
    async (person: any) => {
      if (!stripe) throw new Error("An error occurred. Try again...");
      if (!person)
        throw new Error("Person data is required to create person token");

      const personRes = await stripe.createToken("person", person);

      if (personRes.error) throw new Error(personRes.error.message);

      return personRes.token?.id;
    },
    [stripe]
  );

  const generateBusinessToken = useCallback(
    async (
      business_type: BusinessType,
      person: Individual,
      company?: Company
    ) => {
      if (!business_type || !person)
        throw new Error(
          "Business type and person data are required to create token"
        );

      let account_type_object;
      let person_token;
      const isIndividual = getIsIndividual(business_type);

      if (isIndividual) account_type_object = person;
      else {
        if (!company)
          throw new Error("Company data is required to create company token");
        account_type_object = company;
        person_token = await generatePersonToken(person);
      }

      const account_token = await generateAccountToken(
        business_type,
        account_type_object
      );

      return {
        account_token,
        person_token,
      };
    },
    [generateAccountToken, generatePersonToken]
  );

  const generateExternalAccountToken = useCallback(
    async (
      externalAccountDetails: Partial<ExternalAccount>,
      tokenType: ExternalAccountObject
    ) => {
      if (!stripe) throw new Error("An error occurred. Try again...");
      if (!externalAccountDetails)
        throw new Error(
          "External account details are required to create external account token"
        );

      const externalAccountRes = await stripe.createToken(tokenType as any, {
        country: "US",
        currency: "usd",
        object: tokenType,
        ...externalAccountDetails,
      });

      if (externalAccountRes.error)
        throw new Error(externalAccountRes.error.message);

      return externalAccountRes.token?.id;
    },
    [stripe]
  );

  return { generateBusinessToken, generateExternalAccountToken };
}
