import User from "@/db/models/user";
import { verifyAuth } from "@/lib/auth";
import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const listBankAccounts = async (accountId: string) => {
  const account = await stripe.accounts.retrieve(accountId);
  if (!account)
    throw {
      statusCode: 404,
      message: "Stripe account not found",
    };

  const externalAccounts = account.external_accounts?.data || [];
  const bankAccounts = externalAccounts.filter(
    ({ object }) => object === "bank_account"
  );

  return bankAccounts;
};

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await verifyAuth(request);

    const user = await User.findOne({
      where: {
        id: user_id,
      },
    });
    if (!user)
      throw {
        statusCode: 404,
        message: "User not found",
      };

    const external_account = headers().get("Bank-Account-Token");
    if (!external_account)
      throw {
        statusCode: 400,
        message: "External account and bank name are required",
      };

    const externalAccount = await stripe.accounts.createExternalAccount(
      user.accountId,
      {
        external_account,
      }
    );

    return NextResponse.json(
      {
        data: {
          externalAccount,
        },
        message: "Bank account created successfully",
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

export async function GET(request: NextRequest) {
  try {
    const { user_id } = await verifyAuth(request);

    const user = await User.findOne({
      where: {
        id: user_id,
      },
    });
    if (!user)
      throw {
        statusCode: 404,
        message: "User not found",
      };

    const bankAccounts = await listBankAccounts(user.accountId);

    return NextResponse.json({
      data: {
        bankAccounts,
      },
      message: "Bank accounts retrieved successfully",
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
