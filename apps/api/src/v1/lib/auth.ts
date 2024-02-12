import { Request } from 'express';
import { jwtVerify, SignJWT } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import { HttpError } from '../utils';

interface UserJwtPayload {
  jti: string;
  iat: number;
  user_id?: string;
}

const MAX_AGE_HOURS = 24; // 24 hours
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const HEADER_NAME = process.env.NEXT_PUBLIC_HEADER_NAME;

const getJwtSecretKey = () => {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0)
    throw new HttpError(
      500,
      'The environment variable JWT_SECRET_KEY is not set.'
    );

  return JWT_SECRET_KEY;
};

const getSession = async (token: string) => {
  const verified = await jwtVerify(
    token,
    new TextEncoder().encode(getJwtSecretKey())
  );
  if (!verified?.payload) throw new HttpError(401, 'Invalid token');

  const session = verified.payload as UserJwtPayload;
  if (!session.user_id) throw new HttpError(401, 'Invalid token');

  const data = {
    user_id: session.user_id,
    token,
  };

  return data;
};

export const verifyAuth = async (request: Request) => {
  if (!HEADER_NAME)
    throw new HttpError(
      500,
      'The environment variable HEADER_NAME is not set.'
    );

  const token = request.headers[HEADER_NAME];
  if (!token) throw new HttpError(401, 'No token provided');

  return await getSession(token as string);
};

export const generateToken = async (issuer: string) => {
  const token = await new SignJWT({
    user_id: issuer,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(uuidv4())
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_HOURS}h`)
    .sign(new TextEncoder().encode(getJwtSecretKey()));

  return token;
};
