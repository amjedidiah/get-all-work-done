import User from "@/db/models/user";
import { verifyAuth } from "@/lib/auth";
import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    const deleted = await stripe.accounts.deleteExternalAccount(
      user.accountId,
      params.slug
    );

    return NextResponse.json({
      data: { deleted },
      message: "Bank account deleted successfully",
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    const updated = await stripe.accounts.updateExternalAccount(
      user.accountId,
      params.slug,
      {
        default_for_currency: true,
      }
    );

    return NextResponse.json({
      data: { updated },
      message: "Bank account has been made default",
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
