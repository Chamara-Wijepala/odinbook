import express from 'express';
import authController from '../controllers/authController';
import type { Router } from 'express';

const router: Router = express.Router();

router.post('/register', authController.createUser);
router.post('/login', authController.loginUser);
router.get('/refresh', authController.refresh);

export default router;
