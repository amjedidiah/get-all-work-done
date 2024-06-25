import { Router } from 'express';
import authRoute from './auth.route';
import accountRoute from './account.route';
import externalAccountRoute from './external-account.route';
import paymentRoute from './payment.route';
import refundRoute from './refund.route';
import connectRoute from './connect.route';
import taxReportRoute from './tax-report.route';
import transferRoute from './transfer.route';

const router = Router();

const { npm_package_name, npm_package_version } = process.env;
router.get('/', (_req, res) =>
  res.send({ name: npm_package_name, version: npm_package_version })
);

router.use('/auth', authRoute);
router.use('/account', accountRoute);
router.use('/external-account', externalAccountRoute);
router.use('/payment', paymentRoute);
router.use('/refund', refundRoute);
router.use('/connect', connectRoute);
router.use('/tax-report', taxReportRoute);
router.use('/transfer', transferRoute);

export default router;
