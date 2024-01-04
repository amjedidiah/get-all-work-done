import stripe from "@/app/lib/stripe";
import {
  extractNames,
  validateDOB,
  validateName,
  validateRequest,
} from "@/app/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export type FirstAndLastNames = {
  first_name: string;
  last_name: string;
};

export type FullName = {
  name: string;
};

export type DOB = {
  day: number;
  month: number;
  year: number;
};

type AccountDetails = {
  dob: DOB;
} & (FirstAndLastNames | FullName);

export async function POST(request: NextRequest) {
  try {
    // Check if request is valid JSON
    validateRequest(request);

    const { dob, ...rest }: AccountDetails = await request.json();
    const { first_name, last_name } = extractNames(rest);

    // Validate fields
    validateName(first_name);
    validateName(last_name);
    validateDOB(dob);

    // Create account
    const account = await stripe.accounts.create({
      country: "US",
      type: "custom",
      capabilities: {
        tax_reporting_us_1099_misc: {
          requested: true,
        },
        bank_transfer_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      business_type: "individual",
      individual: {
        first_name,
        last_name,
        dob: dob,
      },
    });

    // TODO: Store account ID in DB
    // const accountID = account.id;

    return NextResponse.json(
      {
        data: account,
        message: "Connected account created",
        error: false,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { data: null, message: error.message, error: true },
      { status: error.statusCode ?? 500 }
    );
  }
}
