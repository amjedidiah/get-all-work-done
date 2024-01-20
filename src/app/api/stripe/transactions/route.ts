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

    const params = request.nextUrl.searchParams;
    const paramsObject = Object.fromEntries(params.entries());

    const transactions = await stripe.charges.list(paramsObject, {
      stripeAccount: user.accountId,
    });

    return NextResponse.json({
      data: {
        transactions: transactions.data,
        has_more: transactions.has_more,
      },
      message: "Transactions found",
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
