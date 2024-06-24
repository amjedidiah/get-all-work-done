import { Router } from 'express';
import { registerValidator } from '../validators/auth.validator';
import postRegister from '../controllers/auth/register';
import postLogin from '../controllers/auth/login';
import postLogout from '../controllers/auth/logout';

const router = Router();

router.post('/register', registerValidator, postRegister);
router.post('/login', postLogin);
router.post('/logout', postLogout);

export default router;
