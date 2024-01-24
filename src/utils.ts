import {
  BusinessType,
  AccountTypeEnum,
  DOB,
  Contractor,
  ContractorWithShares,
} from "@/types";
import { business_types } from "@/constants";
import { NextResponse } from "next/server";

export const handleRequestError = (error: any) => {
  console.error(error);

  return NextResponse.json(
    {
      data: null,
      message: error.message,
      error: true,
    },
    { status: error.statusCode ?? 500 }
  );
};

export const getIsIndividual = (business_type: BusinessType) =>
  business_type === AccountTypeEnum.individual;

export const validateBusinessType = (business_type: BusinessType) => {
  if (!business_types.includes(business_type))
    throw new Error("Invalid business type");
};

export const extractDOB = (dob_string: string) => {
  // Convert the date string to a Date object
  const dateObject: Date = new Date(dob_string);

  // Extract and return day, month, and year components
  return {
    day: dateObject.getDate(),
    month: dateObject.getMonth() + 1,
    year: dateObject.getFullYear(),
  } as DOB;
};

export const validateDOB = (dob: DOB) => {
  // Extract day, month, and year from the dob
  const { day, month, year } = dob;

  // Create a Date object from the birthday
  const birthday = new Date(`${year}-${month}-${day}`);

  // Calculate the user's age
  const today = new Date();
  const age = today.getFullYear() - birthday.getFullYear();

  // Check if the user has already had their birthday this year
  const isBirthDateNotPassed =
    today.getMonth() === birthday.getMonth() &&
    today.getDate() < birthday.getDate();

  // Subtract 1 from age if birthday hasn't occurred yet this year
  const isAbove18 =
    today.getMonth() < birthday.getMonth() || isBirthDateNotPassed
      ? age - 1 >= 18
      : age >= 18;

  if (!isAbove18)
    throw new Error("You must be 18 years or older to open an account");
};

export const validateName = (type: string, name?: string) => {
  if (!name) throw new Error(`${type} is required`);

  if (name.length < 2 || name.length > 50)
    throw new Error(`${type} must be between 2 and 50 characters`);
};

export const getAccountType = (business_type: BusinessType) => {
  const isIndividual = getIsIndividual(business_type);
  return isIndividual ? AccountTypeEnum.individual : AccountTypeEnum.company;
};

export const isClient = typeof window !== "undefined";

export const convertToQueryString = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

export const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
    minimumFractionDigits: 2,
  }).format(amount / 100);

export const swrFetcher = (url: string) => fetch(url).then((res) => res.json());

export const updateContractorsWithShares = (
  contractors: Array<Contractor | ContractorWithShares>
) => {
  let updatedContractors = [...contractors];

  // If no shares for all contractors
  if (contractors.every((contractor) => !("percentageShare" in contractor)))
    updatedContractors = updatedContractors.map((contractor) => ({
      ...contractor,
      percentageShare: (1 / contractors.length).toFixed(2),
    }));
  // If shares for some contractors
  else if (contractors.some((contractor) => "percentageShare" in contractor)) {
    const totalPercentage = updatedContractors.reduce((total, contractor) => {
      if (!("percentageShare" in contractor)) return total;
      return total + contractor.percentageShare;
    }, 0);
    const balancePercentage = 1 - totalPercentage;
    const contractorsWithoutShares = updatedContractors.filter(
      (contractor) => !("percentageShare" in contractor)
    ).length;

    updatedContractors = updatedContractors.map((contractor) => {
      if (!("percentageShare" in contractor))
        return {
          ...contractor,
          percentageShare: (
            balancePercentage / contractorsWithoutShares
          ).toFixed(2),
        };
      return contractor;
    });
  }

  return updatedContractors.filter(
    ({ isSettled }) => !isSettled
  ) as ContractorWithShares[];
};
