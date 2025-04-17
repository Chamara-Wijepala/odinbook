import express, { Router } from 'express';
import multer from 'multer';
import usersController from '../controllers/usersController';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
	'/:username/avatar',
	upload.single('avatar'),
	usersController.uploadAvatar
);
router.get('/:username', usersController.getUserProfile);
router.patch('/:id/follow', usersController.followUser);
router.patch('/:id/unfollow', usersController.unfollowUser);

export default router;
