import { jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

interface UserJwtPayload {
  jti: string;
  iat: number;
  user_id?: string;
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const TOKEN_NAME = process.env.TOKEN_NAME!;

const MAX_AGE_HOURS = 24; // 24 hours

const MAX_AGE = 60 * 60 * MAX_AGE_HOURS; // 24 hours

const getJwtSecretKey = () => {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0)
    throw new Error("The environment variable JWT_SECRET_KEY is not set.");

  return JWT_SECRET_KEY;
};

const getTokenCookie = () => cookies().get(TOKEN_NAME)?.value;

export const verifyAuth = async () => {
  try {
    const token = getTokenCookie();
    if (!token) return;

    return await getSession(token);
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getSession = async (token?: string) => {
  try {
    if (!token) return;

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );

    if (!verified?.payload) throw new Error("Invalid token");

    const session = verified.payload as UserJwtPayload;

    const data = {
      user_id: session?.user_id,
      token,
    };

    return data;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const generateToken = async (issuer: string) => {
  const token = await new SignJWT({
    user_id: issuer,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_HOURS}h`)
    .sign(new TextEncoder().encode(getJwtSecretKey()));

  return token;
};

export async function setUserCookie(token: string) {
  cookies().set(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export const expireUserCookie = () => {
  cookies().delete(TOKEN_NAME);
};
