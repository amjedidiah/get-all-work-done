import { Request, Response } from 'express';
import { performConnectRequest, handleResponseError } from '../../utils';
import { verifyAuth } from '../../lib/auth';
import { handleGetUserById } from '../../lib/db';

const useConnect = async (request: Request, response: Response) => {
  try {
    const { user_id } = await verifyAuth(request);

    const user = await handleGetUserById(user_id);
    const { data, code } = await performConnectRequest(request, user);

    response.status(code).json({
      data,
      message: `${request.params.object} ${request.params.action}'d successfully`,
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default useConnect;
