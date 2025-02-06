import express from 'express';
import postsController from '../controllers/postsController';
import type { Router } from 'express';

const router: Router = express.Router();

router.post('/', postsController.createPost);
router.get('/explore', postsController.getExplorePage);

export default router;
