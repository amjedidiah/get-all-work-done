import User from "@/db/models/user";
import { verifyAuth } from "@/lib/auth";
import { stripeSecret as stripe } from "@/lib/stripe";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

type StripeAction = keyof typeof stripe;
type StripeObject = keyof (typeof stripe)[keyof typeof stripe];

export async function GET(
  request: NextRequest,
  {
    params: { object, action },
  }: {
    params: {
      object: StripeObject;
      action: StripeAction;
    };
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

    const params = request.nextUrl.searchParams;
    const paramsObject = Object.fromEntries(params.entries());

    let data;
    if ((object as string).includes(".")) {
      const [stripeObject, stripeObjectParam] = (object as string).split(".");
      data = await (
        (stripe[stripeObject as keyof typeof stripe] as any)[stripeObjectParam][
          action
        ] as Function
      )(paramsObject, {
        stripeAccount: user.accountId,
      });
    } else
      data = await (stripe[object][action] as Function)(paramsObject, {
        stripeAccount: user.accountId,
      });

    return NextResponse.json({
      data,
      message: `${object} ${action}'d successfully`,
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}

export async function POST(
  request: NextRequest,
  {
    params: { object, action },
  }: {
    params: {
      object: StripeObject;
      action: StripeAction;
    };
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

    const params = await request.json();

    let data;
    if ((object as string).includes(".")) {
      const [stripeObject, stripeObjectParam] = (object as string).split(".");
      data = await (
        (stripe[stripeObject as keyof typeof stripe] as any)[stripeObjectParam][
          action
        ] as Function
      )(params, {
        stripeAccount: user.accountId,
      });
    } else
      data = await (stripe[object][action] as Function)(params, {
        stripeAccount: user.accountId,
      });

    return NextResponse.json({
      data,
      message: `${object} ${action}'d successfully`,
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params: { object, action },
  }: {
    params: {
      object: StripeObject;
      action: StripeAction;
    };
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

    const params = await request.json();
    const id = request.nextUrl.searchParams.get("id");

    console.log({ params, object, action, id });

    let data;
    if ((object as string).includes(".")) {
      const [stripeObject, stripeObjectParam] = (object as string).split(".");
      data = await (
        (stripe[stripeObject as keyof typeof stripe] as any)[stripeObjectParam][
          action
        ] as Function
      )(id, params, {
        stripeAccount: user.accountId,
      });
    } else
      data = await (stripe[object][action] as Function)(id, params, {
        stripeAccount: user.accountId,
      });

    return NextResponse.json({
      data,
      message: `${object} ${action}'d successfully`,
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
