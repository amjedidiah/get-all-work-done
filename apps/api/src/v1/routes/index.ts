import { Router } from 'express';
import authRoute from './auth.route';
import accountRoute from './account.route';
import externalAccountRoute from './external-account.route';
import paymentRoute from './payment.route';
import refundRoute from './refund.route';
import connectRoute from './connect.route';
import taxReportRoute from './tax-report.route';
import transferRoute from './transfer.route';
import webhookRoute from './webhook.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/account', accountRoute);
router.use('/external-account', externalAccountRoute);
router.use('/payment', paymentRoute);
router.use('/refund', refundRoute);
router.use('/connect', connectRoute);
router.use('/tax-report', taxReportRoute);
router.use('/transfer', transferRoute);
router.use('/webhook', webhookRoute);

export default router;
