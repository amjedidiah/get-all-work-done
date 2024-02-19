import { verifyAuth } from "@/lib/auth";
import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import User from "@/db/models/user";

export async function GET(
  request: NextRequest,
  {
    params: { id = "frr_1OlVoMI8t6XbCC5YU9NtVDKq" },
  }: {
    params: { id: string };
  }
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

    const reportRun = await stripe.reporting.reportRuns.retrieve(id);

    let fileLink;
    if (reportRun.result?.id)
      fileLink = await stripe.fileLinks.create({
        file: reportRun.result?.id,
      });

    return NextResponse.json(
      {
        data: { fileLink },
        message: "Tax report successfully generated",
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
