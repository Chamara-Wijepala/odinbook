import express from 'express';
import postsController from '../controllers/postsController';
import type { Router } from 'express';

const router: Router = express.Router();

router.post('/', postsController.createPost);
router.get('/explore', postsController.getExplorePage);
router.patch('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);

export default router;
