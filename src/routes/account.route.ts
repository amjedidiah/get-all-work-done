import { Router } from 'express';
import getAccount from '../controllers/account/get';
import patchAccount from '../controllers/account/patch';
import postAccountSession from '../controllers/account/session';
import { accountSessionValidator } from '../validators/account.validator';

const router = Router();

router.get('/', getAccount);
router.patch('/', patchAccount);
router.post('/session', accountSessionValidator, postAccountSession);

export default router;
