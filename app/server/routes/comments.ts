import express, { Router } from 'express';
import commentsController from '../controllers/commentsController';

const router: Router = express.Router({ mergeParams: true });

router.post('/', commentsController.create);
router.post('/:commentId', commentsController.create);
router.get('/', commentsController.getComments);
router.get('/:commentId', commentsController.getComments);
router.get('/:commentId/thread', commentsController.getSingleThread);
router.patch('/:commentId', commentsController.update);
router.delete('/:commentId', commentsController.deleteComment);
router.patch('/:commentId/like', commentsController.like);

export default router;
