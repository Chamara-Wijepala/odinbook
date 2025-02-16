import express from 'express';
import postsController from '../controllers/postsController';
import type { Router } from 'express';

const router: Router = express.Router();

router.post('/', postsController.createPost);
router.patch('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);
router.get('/explore', postsController.getExplorePage);
router.get('/home', postsController.getHomePage);

export default router;
