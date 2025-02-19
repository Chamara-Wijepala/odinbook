import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import { TiDeleteOutline } from 'react-icons/ti';
import { AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import useAuthStore from '../../stores/auth';
import UpdatePost from '../update-post';
import Modal from '../modal';
import coloredNotification from '../../services/notifications';
import api from '../../api';
import { AxiosError } from 'axios';

export default function Dialog({
	authorId,
	postId,
	postContent,
}: {
	authorId: string;
	postId: string;
	postContent: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [modalContent, setModalContent] = useState<React.ReactNode | null>(
		null
	);
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const navigate = useNavigate();
	const user = useAuthStore((state) => state.user);
	const updateUserFollowing = useAuthStore(
		(state) => state.updateUserFollowing
	);
	const deleteUserFollowing = useAuthStore(
		(state) => state.deleteUserFollowing
	);

	function toggleDialog() {
		if (!dialogRef.current) return;

		if (dialogRef.current.hasAttribute('open')) {
			dialogRef.current.close();
			setIsOpen(false);
		} else {
			dialogRef.current.show();
			setIsOpen(true);
		}
	}

	// close dialog if user clicks outside dialog, the toggle dialog button, or
	// the escape key
	function closeDialog(e: MouseEvent | KeyboardEvent) {
		if (!dialogRef.current || !buttonRef.current) return;

		if (e instanceof KeyboardEvent && e.key === 'Escape') {
			dialogRef.current.close();
			setIsOpen(false);
			return;
		}

		const target = e.target as Node;
		if (
			!dialogRef.current.contains(target) &&
			!buttonRef.current.contains(target)
		) {
			dialogRef.current.close();
			setIsOpen(false);
		}
	}

	function toggleModal() {
		if (!modalRef.current) return;

		modalRef.current.hasAttribute('open')
			? modalRef.current.close()
			: modalRef.current.showModal();
	}

	async function handleDelete() {
		try {
			await api.delete(`/posts/${postId}`);
			toggleModal();
			coloredNotification({ type: 'success', message: 'Post deleted.' });
			navigate('/');
		} catch (error) {
			if (error instanceof AxiosError) {
				const { toast } = error.response?.data;
				coloredNotification(toast);
				toggleModal();
			}
		}
	}

	async function followUser() {
		try {
			await api.patch(`/users/${authorId}/follow`);

			updateUserFollowing(authorId);
		} catch (error) {
			console.log(error);
		}
	}

	async function unfollowUser() {
		try {
			await api.patch(`/users/${authorId}/unfollow`);

			deleteUserFollowing(authorId);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('mousedown', closeDialog);
			window.addEventListener('keydown', closeDialog);
		}

		return () => {
			if (isOpen) {
				window.removeEventListener('mousedown', closeDialog);
				window.removeEventListener('keydown', closeDialog);
			}
		};
	}, [isOpen]);

	return (
		<div
			onClick={(e) => e.preventDefault()} // prevent event bubbling
			className="ml-auto relative"
		>
			<button
				ref={buttonRef}
				onClick={toggleDialog}
				className="w-6 h-6 flex rounded-full items-center justify-center hover:text-sky-600 hover:bg-sky-100 hover:dark:text-sky-300 hover:dark:bg-sky-900 transition-colors"
			>
				<BsThreeDotsVertical />
			</button>

			<dialog
				ref={dialogRef}
				// On -translate-x-[calc(100%-20px)] the 20px is the width of the button
				// up top. It's used to align the dialog's right side with the button.
				className="absolute -translate-x-[calc(100%-20px)] z-50 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-lg overflow-hidden shadow-lg"
			>
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
													onClick={handleDelete}
													className="bg-rose-500 hover:bg-rose-400 py-2 px-4 rounded-full transition-colors"
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
									onClick={unfollowUser}
									className="w-full py-4 px-6 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
								>
									<AiOutlineUserDelete />
									<span>Unfollow</span>
								</button>
							) : (
								<button
									onClick={followUser}
									className="w-full py-4 px-6 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
								>
									<AiOutlineUserAdd />
									<span>Follow</span>
								</button>
							)}
						</li>
					)}
				</ul>
			</dialog>

			<Modal toggleModal={toggleModal} ref={modalRef}>
				{modalContent}
			</Modal>
		</div>
	);
}
