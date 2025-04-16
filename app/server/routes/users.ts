import path from 'path';
import express, { Router } from 'express';
import multer from 'multer';
import usersController from '../controllers/usersController';

// temporarily store the images on disk for testing
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + uniqueSuffix + '.webp');
	},
});

const router: Router = express.Router();
const upload = multer({ storage });

router.post(
	'/:username/avatar',
	upload.single('avatar'),
	usersController.uploadAvatar
);
router.get('/:username', usersController.getUserProfile);
router.patch('/:id/follow', usersController.followUser);
router.patch('/:id/unfollow', usersController.unfollowUser);

export default router;
