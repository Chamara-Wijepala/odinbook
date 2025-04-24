import { ReactElement, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { DateTime } from 'luxon';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { LiaCameraRetroSolid } from 'react-icons/lia';
import { FiUploadCloud } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import useAuthStore from '../../stores/auth';
import useData from '../../hooks/useData';
import UserPosts from './user-posts';
import BackButton from '../../components/back-button';
import Dialog from '../../components/dialog';
import Modal from '../../components/modal';
import ImageCropper from '../../components/image-cropper';
import DefaultAvatar from '../../components/default-avatar';
import api from '../../api';

// The width of the profile picture must be equivalent to this in pixels. This
// cannot be used by itself because of the way Tailwind handles dynamic values.
const MIN_DIMENSION = 120;

type User = {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	createdAt: string;
	_count: {
		posts: number;
		followedBy: number;
		following: number;
	};
	avatar: { id: string; url: string } | null;
};

function formatDate(isoString: string) {
	return DateTime.fromISO(isoString).toFormat('MMM d, yyyy');
}

export default function Profile() {
	const params = useParams();
	const { isLoading, data: user } = useData<User>(`/users/${params.username}`);
	const [isPending, setIsPending] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState<ReactElement | null>(null);
	const currentUser = useAuthStore((state) => state.user);
	const updateUserFollowing = useAuthStore(
		(state) => state.updateUserFollowing
	);
	const deleteUserFollowing = useAuthStore(
		(state) => state.deleteUserFollowing
	);
	const dialogBtnRef = useRef<HTMLButtonElement | null>(null);
	const navigate = useNavigate();

	async function handleFollow() {
		if (!user) return;

		try {
			if (currentUser?.following.includes(user.id)) {
				await api.patch(`/users/${user.id}/unfollow`);
				deleteUserFollowing(user.id);
			} else {
				await api.patch(`/users/${user.id}/follow`);
				updateUserFollowing(user.id);
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function deleteAvatar() {
		try {
			setIsPending(true);
			await api.delete(
				`/users/${currentUser?.username}/avatar?avatarId=${user?.avatar?.id}`
			);
			navigate(0);
		} catch (error) {
			/**
			 * A 403 error will be returned if user tries to delete another user's
			 * avatar. However, since the controls will only available for users to
			 * update/delete their own avatars, handling this error isn't really
			 * necessary.
			 */
		} finally {
			setIsPending(false);
		}
	}

	return (
		<div>
			<div className="p-4">
				<BackButton />
			</div>

			{isLoading && <Skeleton />}

			{!isLoading && !user && (
				<div className="flex flex-col justify-center items-center p-4 text-center">
					<h2 className="text-2xl font-bold">
						We couldn't find the user you're looking for!
					</h2>

					<p className="text-lg">
						Go to{' '}
						<Link to="/" className="text-sky-400 hover:text-sky-300">
							homepage
						</Link>
					</p>
				</div>
			)}

			{!isLoading && user && (
				<>
					<div>
						<div className="p-4 border-b-[1px] border-slate-300 dark:border-slate-800">
							<div>
								{/* profile picture */}
								<div className="relative flex items-center justify-center gap-2 w-[80px] sm:w-[120px] aspect-square">
									{/* avatar */}
									<div className="w-[80px] sm:w-[120px] aspect-square rounded-full overflow-hidden">
										{user.avatar || currentUser?.avatar ? (
											<img
												// replace url from fetched user for the one in auth store to display the
												// updated avatar without reloading
												src={
													currentUser?.avatar
														? currentUser.avatar.url
														: user.avatar!.url
												}
												alt={user.username}
											/>
										) : (
											<DefaultAvatar />
										)}
									</div>

									{/* toggle dialog button */}
									{user.id === currentUser?.id && (
										<div className="absolute right-0 bottom-0">
											<div className="relative">
												{/* open dialog/modal button */}
												<button
													ref={dialogBtnRef}
													onClick={() => {
														if (currentUser?.avatar || user.avatar) {
															setIsDialogOpen(!isDialogOpen);
															return;
														}
														setModalContent(
															<ImageCropper
																dimension={MIN_DIMENSION}
																username={user.username}
																setIsModalOpen={setIsModalOpen}
															/>
														);
														setIsModalOpen(!isModalOpen);
													}}
													className="bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors rounded-full p-2"
												>
													<LiaCameraRetroSolid />
												</button>

												{/* dialog */}
												<Dialog
													isOpen={isDialogOpen}
													setIsOpen={setIsDialogOpen}
													buttonRef={dialogBtnRef}
													className="-translate-x-1/2 left-1/2 top-10"
												>
													{/* upload avatar button */}
													<button
														disabled={isPending}
														onClick={() => {
															setModalContent(
																<ImageCropper
																	dimension={MIN_DIMENSION}
																	username={user.username}
																	setIsModalOpen={setIsModalOpen}
																/>
															);
															setIsModalOpen(!isModalOpen);
														}}
														className="w-full py-4 px-6 flex items-center gap-2 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-wait transition-colors"
													>
														<FiUploadCloud />
														<span>Upload</span>
													</button>

													{/* delete avatar button */}
													<button
														disabled={isPending}
														onClick={() => {
															setModalContent(
																// confirm delete popup
																<div>
																	<h2 className="text-xl my-4">
																		Are you sure you want to delete this post?
																	</h2>
																	<div className="flex gap-2 justify-end">
																		<button
																			onClick={() => setIsModalOpen(false)}
																			className="bg-sky-400 hover:bg-sky-300 disabled:opacity-60 disabled:hover:bg-sky-400 disabled:cursor-not-allowed py-2 px-4 rounded-full transition-colors"
																		>
																			Cancel
																		</button>

																		<button
																			disabled={isPending}
																			onClick={deleteAvatar}
																			className="bg-rose-500 hover:bg-rose-400 py-2 px-4 rounded-full disabled:cursor-wait disabled:opacity-50 disabled:hover:bg-rose-500 transition-colors"
																		>
																			Delete
																		</button>
																	</div>
																</div>
															);
															setIsModalOpen(!isModalOpen);
														}}
														className="w-full py-4 px-6 flex items-center gap-2 font-bold hover:bg-rose-200 dark:hover:bg-rose-900 disabled:hover:bg-transparent disabled:opacity-50 disabled:cursor-wait transition-colors"
													>
														<TiDeleteOutline />
														<span>Delete</span>
													</button>
												</Dialog>
											</div>
										</div>
									)}
								</div>

								<div className="my-6 text-sm sm:text-base flex gap-x-1 items-start">
									{/* name and handle */}
									<div>
										<p className="font-semibold">
											{user.firstName} {user.lastName}
										</p>
										<p className="text-slate-500 text-xs sm:text-sm">
											@{user.username}
										</p>
									</div>

									{/* follow button */}
									{user.id !== currentUser?.id && (
										<button
											onClick={handleFollow}
											className="ml-auto bg-sky-400 hover:bg-sky-300 font-semibold py-1 px-3 rounded-full"
										>
											{currentUser?.following.includes(user.id)
												? 'Unfollow'
												: 'Follow'}
										</button>
									)}
								</div>

								{/* join date */}
								<div className="my-6 text-slate-500 flex gap-2 items-center">
									<FaRegCalendarAlt />
									<p>Joined {formatDate(user.createdAt)}</p>
								</div>

								{/* follower and post count */}
								<div className="flex gap-x-4">
									<p>
										<span className="font-semibold">
											{user._count.following}
										</span>{' '}
										<span className="text-slate-500">Following</span>
									</p>

									<p>
										<span className="font-semibold">
											{user._count.followedBy}
										</span>{' '}
										<span className="text-slate-500">
											{user._count.followedBy === 1 ? 'Follower' : 'Followers'}
										</span>
									</p>

									<span className="text-slate-500">·</span>

									<p>
										<span className="font-semibold">{user._count.posts}</span>{' '}
										<span className="text-slate-500">
											{user._count.posts === 1 ? 'Post' : 'Posts'}
										</span>
									</p>
								</div>
							</div>
						</div>

						<UserPosts id={user.id} />
					</div>

					<Modal isOpen={isModalOpen}>{modalContent}</Modal>
				</>
			)}
		</div>
	);
}

function Skeleton() {
	return (
		<div className="p-4 animate-pulse">
			<div className="bg-slate-200 dark:bg-slate-700 rounded-full w-[80px] sm:w-[100px] aspect-square"></div>

			<div className="my-6 flex gap-x-1 items-start">
				<div>
					<div className="flex gap-x-1 mb-2">
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-20"></div>
						<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-24"></div>
					</div>

					<div className="bg-slate-200 dark:bg-slate-700 rounded-md h-4 w-32"></div>
				</div>

				<div className="ml-auto bg-slate-200 dark:bg-slate-700 h-8 w-20 rounded-full"></div>
			</div>

			<div className="my-6 bg-slate-200 dark:bg-slate-700 h-4 w-32 rounded-md"></div>

			<div className="flex gap-x-4 items-center">
				<div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-md"></div>
				<div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-md"></div>

				<span className="text-slate-500">·</span>

				<div className="bg-slate-200 dark:bg-slate-700 h-4 w-16 rounded-md"></div>
			</div>
		</div>
	);
}
