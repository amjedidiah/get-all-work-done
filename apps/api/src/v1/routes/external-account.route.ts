import { Router } from 'express';
import {
  getExternalAccountValidator,
  postExternalAccountValidator,
} from '../validators/external-account.validator';
import postExternalAccount from '../controllers/external-account/post';
import getExternalAccount from '../controllers/external-account/get';
import deleteExternalAccount from '../controllers/external-account/delete';
import patchExternalAccount from '../controllers/external-account/patch';

const router = Router();

router.get('/', getExternalAccountValidator, getExternalAccount);
router.post('/', postExternalAccountValidator, postExternalAccount);
router.delete('/:slug', deleteExternalAccount);
router.patch('/:slug', patchExternalAccount);

export default router;
