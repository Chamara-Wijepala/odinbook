import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { LiaCameraRetroSolid } from 'react-icons/lia';
import { FiUploadCloud } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';
import useAuthStore from '../../stores/auth';
import Dialog from '../../components/dialog';
import Modal from '../../components/modal';
import ImageCropper from '../../components/image-cropper';
import DefaultAvatar from '../../components/default-avatar';
import api from '../../api';
import type { ReactElement } from 'react';

// The width of the profile picture must be equivalent to this in pixels. This
// cannot be used by itself because of the way Tailwind handles dynamic values.
const MIN_DIMENSION = 120;

export default function Avatar({
	userId,
	username,
	avatarId,
	avatarUrl,
}: {
	userId: string;
	username: string;
	avatarId: string | null;
	avatarUrl: string | null;
}) {
	const [isPending, setIsPending] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState<ReactElement | null>(null);
	const currentUser = useAuthStore((s) => s.user);
	const dialogBtnRef = useRef<HTMLButtonElement | null>(null);
	const navigate = useNavigate();

	async function deleteAvatar() {
		try {
			setIsPending(true);
			await api.delete(
				// Using the currentUser's avatar id when it's present fixes an error
				// when deleting the avatar immediately after uploading it for the first
				// time.
				`/users/${currentUser?.username}/avatar?avatarId=${
					currentUser?.avatar ? currentUser.avatar.id : avatarId
				}`
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
		<>
			<div className="relative flex items-center justify-center gap-2 w-[80px] sm:w-[120px] aspect-square">
				{/* avatar */}
				<div className="w-[80px] sm:w-[120px] aspect-square rounded-full overflow-hidden">
					{avatarUrl || currentUser?.avatar ? (
						<img
							// replace url from fetched user for the one in auth store to display the
							// updated avatar without reloading
							src={currentUser?.avatar ? currentUser.avatar.url : avatarUrl!}
							alt={username}
						/>
					) : (
						<DefaultAvatar />
					)}
				</div>

				{/* toggle dialog button */}
				{userId === currentUser?.id && (
					<div className="absolute right-0 bottom-0">
						<div className="relative">
							{/* open dialog/modal button */}
							<button
								ref={dialogBtnRef}
								onClick={() => {
									if (currentUser?.avatar || avatarId) {
										setIsDialogOpen(!isDialogOpen);
										return;
									}
									setModalContent(
										<ImageCropper
											dimension={MIN_DIMENSION}
											username={username}
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
												username={username}
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
														disabled={isPending}
														onClick={() => setIsModalOpen(false)}
														className="bg-sky-400 hover:bg-sky-300 disabled:opacity-60 disabled:hover:bg-sky-400 disabled:cursor-wait py-2 px-4 rounded-full transition-colors"
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

			<Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
				{modalContent}
			</Modal>
		</>
	);
}
