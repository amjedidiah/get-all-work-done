import { Request, Response } from 'express';
import { getConnectData, handleResponseError } from '../../utils';
import { verifyAuth } from '../../lib/auth';
import { handleGetUserById } from '../../lib/db';

const useConnect = async (request: Request, response: Response) => {
  try {
    const { user_id } = await verifyAuth(request);

    const user = await handleGetUserById(user_id);
    const data = await getConnectData(request, user);

    response.status(200).json({
      data,
      message: `${request.params.object} ${request.params.action}'d successfully`,
    });
  } catch (error) {
    handleResponseError(response, error);
  }
};

export default useConnect;
