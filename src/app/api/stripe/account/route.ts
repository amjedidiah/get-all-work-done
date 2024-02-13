import { verifyAuth } from "@/lib/auth";
import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import User from "@/db/models/user";

const createBusinessPerson = async (
  account_id: string,
  person_token: string | null
) => {
  const isPersonTokenValid =
    person_token !== "undefined" && person_token !== "null";
  if (person_token && isPersonTokenValid)
    await stripe.accounts.createPerson(account_id, {
      person_token,
    });
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const { user_id } = await verifyAuth(request);

    const account_token = headers().get("account-token");
    const person_token = headers().get("person-token");

    if (!account_token)
      throw {
        message: "Account token is required",
        statusCode: 400,
      };

    // Check if user exist in db first before creating account
    const existingUser = await User.findOne({
      where: {
        id: user_id,
      },
    });

    if (existingUser) throw new Error("User already exists");

    // Create account now with default country US
    // TODO: Later on create account with user's country of operation
    const account = await stripe.accounts.create({
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
        card_payments: {
          requested: true,
        },
      },
      account_token,
      metadata: {
        user_id,
      },
      settings: {
        payouts: {
          schedule: {
            interval: "weekly",
            weekly_anchor: "friday",
          },
        },
      },
    });
    const account_id = account.id;

    // If person_token is present, associate business with person
    createBusinessPerson(account_id, person_token);

    // Store account ID & issuer in DB
    await User.create({
      id: user_id,
      accountId: account_id,
      email,
    });

    return NextResponse.json(
      {
        data: { user_id, account },
        message: `Connected account created`,
        error: false,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return handleRequestError(error);
  }
}
