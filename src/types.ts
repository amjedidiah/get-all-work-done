import Stripe from "stripe";

export type DOB = Stripe.AccountCreateParams.Individual.Dob;

export type BusinessType = Stripe.TokenCreateParams.Account.BusinessType;

export type Individual = Stripe.TokenCreateParams.Account.Individual;

export type Company = Stripe.TokenCreateParams.Account.Company;

export type AccountTypeObject = Individual | Company;

export enum AccountTypeEnum {
  individual = "individual",
  company = "company",
}

export enum BusinessTypeEnum {
  individual = "individual",
  company = "company",
  government_entity = "government_entity",
  non_profit = "non_profit",
}

export type RegisterFormValues = {
  email: string;
  dob_string: string;
  business_type: BusinessType;
  company_name?: string;
};
