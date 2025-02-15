import express, { Router } from 'express';
import usersController from '../controllers/usersController';

const router: Router = express.Router();

router.patch('/:id/follow', usersController.followUser);
router.patch('/:id/unfollow', usersController.unfollowUser);

export default router;
