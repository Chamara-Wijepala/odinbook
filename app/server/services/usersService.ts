import { v2 as cloudinary } from 'cloudinary';
import usersRepository from '../repositories/usersRepository';
import type { UploadApiOptions } from 'cloudinary';

async function uploadAvatar(userId: string, file: Express.Multer.File) {
	const b64 = Buffer.from(file.buffer).toString('base64');
	const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

	const existingAvatar = await usersRepository.findAvatar(userId);

	let options: UploadApiOptions = {
		use_filename: true,
		unique_filename: false,
		overwrite: true,
		asset_folder: 'avatars',
		resource_type: 'image',
	};

	/**
	 * Set the filename_override to the previous avatar's id so that the filename,
	 * which is also the public_id, is consistent whenever an update happens. This
	 * is used to overwrite the previous avatar on cloudinary.
	 *
	 * Doing things like this makes the generated filename on the client obsolete
	 * however. It would need to be refactored to work with cloudinary.
	 */
	existingAvatar
		? (options.filename_override = existingAvatar.id)
		: (options.filename_override = file.originalname);

	try {
		const result = await cloudinary.uploader.upload(dataURI, options);

		let avatar;
		if (existingAvatar) {
			avatar = await usersRepository.updateAvatar(
				existingAvatar.id,
				result.secure_url
			);
		} else {
			avatar = await usersRepository.createAvatar(
				result.public_id,
				result.secure_url,
				userId
			);
		}

		return avatar.url;
	} catch (error) {
		throw error; // unexpected error
	}
}

async function getUserProfile(username: string) {
	const data = await usersRepository.getProfileData(username);

	if (!data) {
		return null;
	}

	return data;
}

async function followUser(currentUserId: string, id: string) {
	// If user tries to follow themself.
	if (currentUserId === id) return { status: 400 };

	await usersRepository.followUser(currentUserId, id);

	return { status: 200 };
}

async function unfollowUser(currentUserId: string, id: string) {
	// If user tries to unfollow themself.
	if (currentUserId === id) return { status: 400 };

	await usersRepository.unfollowUser(currentUserId, id);

	return { status: 200 };
}

export default {
	uploadAvatar,
	getUserProfile,
	followUser,
	unfollowUser,
};
