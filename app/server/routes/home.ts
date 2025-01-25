import express from 'express';
import homeController from '../controllers/homeController';
import type { Router } from 'express';

const router: Router = express.Router();

router.get('/', homeController.getHomePage);

export default router;
