import User from "@/db/models/user";
import { verifyAuth } from "@/lib/auth";
import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

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

    const account = await stripe.accounts.retrieve(user.accountId);
    if (!account)
      throw {
        statusCode: 404,
        message: "Stripe account not found",
      };

    return NextResponse.json({
      data: {
        user,
        account,
      },
      message: "User found",
      error: false,
    });
  } catch (error: any) {
    return handleRequestError(error);
  }
}
