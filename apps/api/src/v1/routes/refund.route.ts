import { Router } from 'express';
import postFullRefund from '../controllers/refund/full';
import {
  fullRefundValidator,
  partialRefundValidator,
} from '../validators/refund.validator';
import postPartialRefund from '../controllers/refund/partial';

const router = Router();

router.post('/full', fullRefundValidator, postFullRefund);
router.post('/partial', partialRefundValidator, postPartialRefund);

export default router;
