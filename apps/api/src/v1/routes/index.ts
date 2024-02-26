import { Router } from 'express';
import authRoute from './auth.route';
import accountRoute from './account.route';
import externalAccountRoute from './external-account.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/account', accountRoute);
router.use('/external-account', externalAccountRoute);

export default router;
