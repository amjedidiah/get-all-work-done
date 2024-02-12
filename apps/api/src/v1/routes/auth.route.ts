import { Router } from 'express';
import { registerValidator } from '../validators/auth.validator';
import { postRegister } from '../controllers/auth/register';

const router = Router();

router.post('/register', registerValidator, postRegister);

export default router;
