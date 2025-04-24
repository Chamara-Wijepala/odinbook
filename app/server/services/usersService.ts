import { v2 as cloudinary } from 'cloudinary';
import usersRepository from '../repositories/usersRepository';
import type { UploadApiOptions } from 'cloudinary';

async function uploadAvatar(userId: string, file: Express.Multer.File) {
	const b64 = Buffer.from(file.buffer).toString('base64');
	const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

	const existingAvatar = await usersRepository.findAvatar(userId);

	let options: UploadApiOptions = {
		// Keeps the public_id consistent so the avatar can be overwritten
		public_id: existingAvatar ? existingAvatar.id : undefined,
		overwrite: true,
		asset_folder: 'avatars',
		resource_type: 'image',
	};

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

		return { id: avatar.id, url: avatar.url };
	} catch (error) {
		throw error; // unexpected error
	}
}

async function deleteAvatar(id: string, userId: string) {
	/**
	 * Getting the avatar to verify the user is expensive, but it's harder to
	 * handle prisma's RecordNotFound error thrown when it can't find the record
	 * to update or delete.
	 *
	 * Otherwise, trying to delete the record directly using the id and userId
	 * would preferable.
	 */
	const avatar = await usersRepository.findAvatar(userId);

	if (!avatar) {
		return 403;
	}

	await cloudinary.uploader.destroy(id, {
		resource_type: 'image',
		invalidate: true,
	});

	await usersRepository.deleteAvatar(id, userId);

	return 204;
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
	deleteAvatar,
	getUserProfile,
	followUser,
	unfollowUser,
};
