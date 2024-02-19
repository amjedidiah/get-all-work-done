import { verifyAuth } from "@/lib/auth";
import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import User from "@/db/models/user";

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

    const { data: reports } = await stripe.reporting.reportRuns.list();

    return NextResponse.json(
      {
        data: { reports },
        message: "Tax report requested",
        error: false,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleRequestError(error);
  }
}

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

    const { interval_start, interval_end } = await request.json();
    if (!interval_end || !interval_start)
      throw {
        statusCode: 400,
        message: "Start and end intervals are required",
      };

    const report = await stripe.reporting.reportRuns.create({
      report_type: "connected_account_tax.transactions.itemized.2",
      parameters: {
        interval_start,
        interval_end,
        connected_account: user.accountId,
      },
    });

    return NextResponse.json(
      {
        data: { report },
        message: "Tax report requested",
        error: false,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleRequestError(error);
  }
}
