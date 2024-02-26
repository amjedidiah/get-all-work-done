import { Router } from 'express';
import authRoute from './auth.route';
import accountRoute from './account.route';
import externalAccountRoute from './external-account.route';
import paymentRoute from './payment.route';
import refundRoute from './refund.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/account', accountRoute);
router.use('/external-account', externalAccountRoute);
router.use('/payment', paymentRoute);
router.use('/refund', refundRoute);

export default router;
