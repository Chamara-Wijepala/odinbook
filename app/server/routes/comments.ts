import express, { Router } from 'express';
import commentsController from '../controllers/commentsController';

const router: Router = express.Router({ mergeParams: true });

router.post('/', commentsController.create);
router.get('/', commentsController.getComments);
router.patch('/:commentId', commentsController.update);
router.delete('/:commentId', commentsController.deleteComment);

export default router;
