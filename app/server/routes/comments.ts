import express, { Router } from 'express';
import commentsController from '../controllers/commentsController';

const router: Router = express.Router({ mergeParams: true });

router.post('/', commentsController.create);

export default router;
