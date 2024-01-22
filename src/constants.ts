import { AccountTypeEnum, BusinessType, BusinessTypeEnum } from "@/types";

export const platform_name = "GetAllWorkDone";

export const account_types = Object.values(AccountTypeEnum);

export const business_types: BusinessType[] = Object.values(BusinessTypeEnum);

export const gigs = [
  {
    id: "gig_khwe32",
    title: "Lumber cutting",
    price: 2000,
    platformFeePercentage: 0.1,
    contractors: [{ id: "acct_1OaemaRP8u8di6rL" }],
  },
  {
    id: "gig_u2dn21",
    title: "Snow packing",
    price: 5000,
    platformFeePercentage: 0.2,
    contractors: [
      { id: "acct_1OZhPTI89diiTOrD" },
      { id: "acct_1OZHXtIZ3hc5uLXA" },
    ],
  },
  {
    id: "gig_922jd9",
    title: "Road repairs",
    price: 10000,
    platformFeePercentage: 0.15,
    contractors: [
      { id: "acct_1OZhkwIGWz9N1AyF" },
      { id: "acct_1OZF0aRH70YkBmCp" },
      { id: "acct_1OZhPTI89diiTOrD" },
    ],
  },
];