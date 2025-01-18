import express from 'express';
import authController from '../controllers/authController';
import type { Router } from 'express';

const router: Router = express.Router();

router.post('/register', authController.createUser);

export default router;
