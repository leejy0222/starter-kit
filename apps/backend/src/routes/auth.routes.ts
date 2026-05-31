import { Router } from 'express';
import { authController } from '../controller/auth.controller';

const router = Router();

router.post('/sign-up', (req, res, next) =>
  authController.signUp(req, res).catch(next),
);
router.post('/sign-in', (req, res, next) =>
  authController.signIn(req, res).catch(next),
);

export default router;
