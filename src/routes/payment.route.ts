import { Router } from 'express';
import {
  patchPaymentValidator,
  postPaymentValidator,
} from '../validators/payment.validator';
import postPayment from '../controllers/payment/post';
import patchPayment from '../controllers/payment/patch';

const router = Router();

router.post('/', postPaymentValidator, postPayment);
router.patch('/', patchPaymentValidator, patchPayment);

export default router;
