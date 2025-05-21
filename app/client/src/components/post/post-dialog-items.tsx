import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { TiDeleteOutline } from 'react-icons/ti';
import useAuthStore from '../../stores/auth';
import UpdatePost from '../update-post';
import Modal from '../modal';
import coloredNotification from '../../services/notifications';
import api from '../../api';
import { AxiosError } from 'axios';

type Props = {
	authorId: string;
	postId: string;
	postContent: string;
};

export default function DialogItems({ authorId, postId, postContent }: Props) {
	const [isPending, setIsPending] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState<React.ReactNode | null>(
		null
	);
	const user = useAuthStore((s) => s.user);
	const updateUserFollowing = useAuthStore((s) => s.updateUserFollowing);
	const deleteUserFollowing = useAuthStore((s) => s.deleteUserFollowing);
	const navigate = useNavigate();
	const location = useLocation();

	function toggleModal() {
		setIsModalOpen((prev) => !prev);
	}

	async function followUser() {
		try {
			setIsPending(true);
			await api.patch(`/users/${authorId}/follow`);

			updateUserFollowing(authorId);
		} catch (error) {
			console.log(error);
		} finally {
			setIsPending(false);
		}
	}

	async function unfollowUser() {
		try {
			setIsPending(true);
			await api.patch(`/users/${authorId}/unfollow`);

			deleteUserFollowing(authorId);
		} catch (error) {
			console.log(error);
		} finally {
			setIsPending(false);
		}
	}

	async function handleDelete() {
		try {
			setIsPending(true);
			await api.delete(`/posts/${postId}`);
			toggleModal();
			coloredNotification({ type: 'success', message: 'Post deleted.' });
			// navigate to home when on post page, refresh when on other pages.
			if (location.pathname.split('/')[1] === 'post') {
				navigate('/');
			} else {
				navigate(0);
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				const { toast } = error.response?.data;
				coloredNotification(toast);
				toggleModal();
			}

			console.log(error);
		} finally {
			setIsPending(false);
		}
	}

	return (
		<>
			<ul className="font-semibold">
				{authorId === user?.id && (
					<li>
						<button
							onClick={() => {
								setModalContent(
									<div className="w-[600px] max-w-full h-fit">
										<UpdatePost
											postId={postId}
											postContent={postContent}
											toggleModal={toggleModal}
										/>
									</div>
								);
								toggleModal();
							}}
							className="w-full py-4 px-6 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
						>
							<FaRegEdit />
							<span>Update</span>
						</button>
					</li>
				)}

				{authorId === user?.id && (
					<li>
						<button
							onClick={() => {
								setModalContent(
									<div>
										<h2 className="text-xl my-4">
											Are you sure you want to delete this post?
										</h2>
										<div className="flex gap-2 justify-end">
											<button
												onClick={toggleModal}
												className="bg-sky-400 hover:bg-sky-300 disabled:opacity-60 disabled:hover:bg-sky-400 disabled:cursor-not-allowed py-2 px-4 rounded-full transition-colors"
											>
												Cancel
											</button>

											<button
												disabled={isPending}
												onClick={handleDelete}
												className="bg-rose-500 hover:bg-rose-400 py-2 px-4 rounded-full disabled:cursor-wait disabled:opacity-50 disabled:hover:bg-rose-500 transition-colors"
											>
												Delete
											</button>
										</div>
									</div>
								);
								toggleModal();
							}}
							className="w-full py-4 px-6 flex items-center gap-2 hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors"
						>
							<TiDeleteOutline />
							<span>Delete</span>
						</button>
					</li>
				)}

				{authorId !== user?.id && (
					<li>
						{user?.following.includes(authorId) ? (
							<button
								disabled={isPending}
								onClick={unfollowUser}
								className="w-full py-4 px-6 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:text-slate-500 disabled:hover:bg-transparent disabled:cursor-wait transition-colors"
							>
								<AiOutlineUserDelete />
								<span>Unfollow</span>
							</button>
						) : (
							<button
								disabled={isPending}
								onClick={followUser}
								className="w-full py-4 px-6 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:text-slate-500 disabled:hover:bg-transparent disabled:cursor-wait transition-colors"
							>
								<AiOutlineUserAdd />
								<span>Follow</span>
							</button>
						)}
					</li>
				)}
			</ul>

			<Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
				{modalContent}
			</Modal>
		</>
	);
}
