import { BusinessType, AccountTypeEnum, DOB } from "@/types";
import { business_types } from "@/constants";
import { NextResponse } from "next/server";

export const handleRequestError = (error: any, shouldRespond = true) => {
  console.error(error);

  if (shouldRespond)
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