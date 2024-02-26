import { Router } from 'express';
import authRoute from './auth.route';
import accountRoute from './account.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/account', accountRoute);

export default router;
