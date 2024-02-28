import { Router } from 'express';
import postConnect from '../controllers/connect/post';

const router = Router();

router.post('/:object/:action', postConnect);

export default router;
