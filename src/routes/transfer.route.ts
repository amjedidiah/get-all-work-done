import { Router } from 'express';
import { postTransferValidator } from '../validators/transfer.validator';
import postTransfer from '../controllers/transfer/post';

const router = Router();

router.post('/', postTransferValidator, postTransfer);

export default router;
