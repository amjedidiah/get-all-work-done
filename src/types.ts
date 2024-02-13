import { DetailedHTMLProps, HTMLAttributes } from "react";
import Stripe from "stripe";
import taxRegistrationData from "@/data/tax-registration.json";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-buy-button": StripeBuyButtonProps;
    }
  }
}

interface StripeBuyButtonProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  ["buy-button-id"]: string;
  ["publishable-key"]: string;
}

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

export type LoginFormValues = {
  email: string;
};

export type BankAccountFormValues = {
  account_number: string;
  routing_number: string;
};

export type WithdrawFormValues = {
  amount: number;
};

export type BankAccount = Stripe.BankAccount;

export type ExternalAccount = Stripe.ExternalAccount;

export type ExternalAccountObject = Stripe.ExternalAccount["object"];

export type TransactionsListParams = Stripe.ChargeListParams;

export type Transaction = Stripe.Charge;

export type Payout = Stripe.Payout;

export type PayoutListParams = Stripe.PayoutListParams;

export type PaymentLink = Stripe.PaymentLink;

export type PaymentIntent = Stripe.PaymentIntent;

export type StripeEvent = Stripe.Event;

export type Balance = Stripe.Balance;

export type StripeAccount = Stripe.Account;

export type Contractor = {
  id: string;
  isSettled: boolean;
};

export type ContractorWithShares = Contractor & {
  percentageShare: number;
};

export type TaxSettings = Stripe.TaxSettingsUpdatedEvent["data"]["object"];

export type TaxRegistration = (typeof taxRegistrationData)["data"][number];