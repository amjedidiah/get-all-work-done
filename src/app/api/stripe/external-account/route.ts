import User from "@/db/models/user";
import { verifyAuth } from "@/lib/auth";
import { stripeSecret as stripe } from "@/lib/stripe";
import { ExternalAccountObject } from "@/types";
import { handleRequestError } from "@/utils";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const listExternalAccountsType = async (
  accountId: string,
  type: ExternalAccountObject
) => {
  const account = await stripe.accounts.retrieve(accountId);
  if (!account)
    throw {
      statusCode: 404,
      message: "Stripe account not found",
    };

  const externalAccounts = account.external_accounts?.data || [];
  const externalAccountsType = externalAccounts.filter(
    ({ object }) => object === type
  );

  return externalAccountsType;
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

    const external_account = headers().get("External-Account-Token");
    if (!external_account)
      throw {
        statusCode: 400,
        message: "External account token is required",
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
        message: "External account created successfully",
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
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");

    if (!type) throw { statusCode: 400, message: "Type is required" };

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

    const externalAccountsType = await listExternalAccountsType(
      user.accountId,
      type as ExternalAccountObject
    );

    return NextResponse.json({
      data: {
        externalAccountsType,
      },
      message: `${type}s retrieved successfully"`,
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
