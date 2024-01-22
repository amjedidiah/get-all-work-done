import { verifyAuth } from "@/lib/auth";
import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextResponse, type NextRequest } from "next/server";

type AccountSession = {
  account_id: string;
};

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request);

    const { account_id: account }: AccountSession = await request.json();
    if (!account) throw { message: `account_id is required"`, statusCode: 400 };

    const accountSession = await stripe.accountSessions.create({
      account,
      components: {
        account_onboarding: {
          enabled: true,
        },
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
          },
        },
        payouts: {
          enabled: true,
        },
      },
    });

    return NextResponse.json(
      {
        data: { client_secret: accountSession.client_secret },
        message: `Account session created successfully for ${account}`,
        error: false,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return handleRequestError(error);
  }
}
