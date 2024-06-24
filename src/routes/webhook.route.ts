import { Router } from 'express';
import postWebhook from '../controllers/webhook/post';
import postConnectWebhook from '../controllers/webhook/post-connect';

const router = Router();

router.post('/', postWebhook);
router.post('/connect', postConnectWebhook);

export default router;
