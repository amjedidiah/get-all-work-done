import { AccountTypeObject, Individual, BusinessType, Company } from "@/types";
import { getAccountType, getIsIndividual, validateBusinessType } from "@/utils";
import { useStripe } from "@stripe/react-stripe-js";

export default function useToken() {
  const stripe = useStripe();

  const generateAccountToken = async (
    business_type: BusinessType,
    account_type_object: AccountTypeObject
  ) => {
    if (!stripe) throw "An error occurred. Try again...";

    validateBusinessType(business_type);
    const account_type = getAccountType(business_type);

    const accountRes = await stripe.createToken("account", {
      business_type,
      tos_shown_and_accepted: true,
      [account_type]: account_type_object,
    });

    return accountRes.token?.id;
  };

  const generatePersonToken = async (person: any) => {
    if (!stripe) throw "An error occurred. Try again...";
    if (!person) throw "Person data is required to create person token";

    const personRes = await stripe.createToken("person", person);

    return personRes.token?.id;
  };

  const generateToken = async (
    business_type: BusinessType,
    person: Individual,
    company?: Company
  ) => {
    if (!business_type || !person)
      throw "Business type and person data are required to create token";

    let account_type_object;
    let person_token;
    const isIndividual = getIsIndividual(business_type);

    if (isIndividual) account_type_object = person;
    else {
      if (!company) throw "Company data is required to create company token";
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
  };

  return generateToken;
}
