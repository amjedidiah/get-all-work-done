import { Request, Response } from 'express';
import { verifyAuth } from '../../lib/auth';
import { handleResponseError } from '../../utils';
import magic from '../../lib/magic';

const postLogout = async (request: Request, response: Response) => {
  try {
    const { user_id } = await verifyAuth(request);
    await magic.users.logoutByIssuer(user_id);

    return response.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default postLogout;
