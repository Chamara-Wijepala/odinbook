import express from 'express';
import authController from '../controllers/authController';
import verifyJWT from '../middleware/verifyJWT';
import type { Router } from 'express';

const router: Router = express.Router();

router.post('/register', authController.createUser);
router.post('/login', authController.loginUser);
router.get('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/logout-all', verifyJWT, authController.logoutFromAllDevices);

export default router;
