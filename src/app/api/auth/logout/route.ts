import { verifyAuth } from "@/lib/auth";
import { magicSecret as magic } from "@/lib/magic";
import { handleRequestError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user_id } = await verifyAuth(req);
    await magic.users.logoutByIssuer(user_id);

    return NextResponse.json({
      message: "Logged out successfully",
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
