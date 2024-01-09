import { jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";

interface UserJwtPayload {
  jti: string;
  iat: number;
  user_id?: string;
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const NEXT_PUBLIC_HEADER_NAME = process.env.NEXT_PUBLIC_HEADER_NAME!;

const MAX_AGE_HOURS = 24; // 24 hours

const getJwtSecretKey = () => {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0)
    throw new Error("The environment variable JWT_SECRET_KEY is not set.");

  return JWT_SECRET_KEY;
};

export const verifyAuth = async (request: NextRequest) => {
  const token = request.headers.get(NEXT_PUBLIC_HEADER_NAME);
  if (!token) throw new Error("No token provided");

  return await getSession(token);
};

export const getSession = async (token: string) => {
  const verified = await jwtVerify(
    token,
    new TextEncoder().encode(getJwtSecretKey())
  );
  if (!verified?.payload) throw new Error("Invalid token");

  const session = verified.payload as UserJwtPayload;

  const data = {
    user_id: session.user_id,
    token,
  };

  return data;
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

export const storeUserToken = async (token: string) =>
  localStorage.setItem(NEXT_PUBLIC_HEADER_NAME, token);

export const expireUserToken = () => {
  localStorage.removeItem(NEXT_PUBLIC_HEADER_NAME);
};

export const retrieveUserToken = () =>
  localStorage.getItem(NEXT_PUBLIC_HEADER_NAME);

export const getAuthStatus = () => {
  const token = retrieveUserToken();

  return !!token;
};
