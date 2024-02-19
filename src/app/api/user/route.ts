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

export async function PATCH(request: NextRequest) {
  try {
    const { dbUpdate, stripeUpdate } = await request.json();
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

    for (const key in dbUpdate) (user as any)[key] = dbUpdate[key];
    await user.save();

    let stripeAccount;
    if (stripeUpdate)
      stripeAccount = await stripe.accounts.update(
        user.accountId,
        stripeUpdate
      );

    return NextResponse.json({
      data: {
        user: user.dataValues,
        account: stripeAccount,
      },
      message: "User has been updated successfully",
      error: false,
    });
  } catch (error: any) {
    return handleRequestError(error);
  }
}



