import { Router } from 'express';
import useConnect from '../controllers/connect/use';

const router = Router();

router.use('/:object/:action', useConnect);

export default router;
