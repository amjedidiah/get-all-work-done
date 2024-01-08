import { magicSecret as magic } from "@/lib/magic";
import { generateToken, setUserCookie } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { handleRequestError } from "@/utils";

export async function POST(request: NextRequest) {
  try {
    // Confirm Authorization header is present
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer "))
      throw {
        message: "Missing Authorization Header",
        statusCode: 401,
      };

    // Confirm DID Token is present
    const didToken = auth.slice(7);
    if (!didToken)
      throw {
        message: "Missing DID Token",
        statusCode: 401,
      };

    // Validate DID Token
    const metadata = await magic.users.getMetadataByToken(didToken);

    // Validate issuer
    if (!metadata.issuer)
      throw {
        message: "Missing issuer",
        statusCode: 401,
      };

    // Create JWT
    const token = await generateToken(metadata.issuer);

    // Set cookie
    setUserCookie(token);

    return NextResponse.json({
      message: "Logged in successfully",
      error: false,
    });
  } catch (error) {
    return handleRequestError(error);
  }
}
