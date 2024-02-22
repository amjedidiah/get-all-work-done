import { Request, Response } from 'express';
import { generateToken } from '../../lib/auth';
import { HttpError, handleResponseError } from '../../utils';
import magic from '../../lib/magic';

const getDIDToken = (request: Request) => {
  // Confirm Authorization header is present
  const auth = request.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    throw new HttpError(401, 'Missing Authorization Header');

  // Confirm DID Token is present
  const didToken = auth.slice(7);
  if (!didToken) throw new HttpError(401, 'Missing DID Token');

  return didToken;
};

const postLogin = async (request: Request, response: Response) => {
  try {
    // Get DID Token
    const didToken = getDIDToken(request);

    // Validate DID Token
    const metadata = await magic.users.getMetadataByToken(didToken);

    // Validate issuer
    if (!metadata.issuer) throw new HttpError(401, 'Missing issuer');

    // Create JWT
    const token = await generateToken(metadata.issuer);

    // Return token to store in local storage
    response.status(200).json({
      data: { token, user_id: metadata.issuer },
      message: 'Logged in successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postLogin;
