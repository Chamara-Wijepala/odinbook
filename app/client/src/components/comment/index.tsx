import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { DateTime } from 'luxon';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import { TiDeleteOutline } from 'react-icons/ti';
import useAuthStore from '../../stores/auth';
import coloredNotification from '../../services/notifications';
import Dialog from '../dialog';
import Modal from '../modal';
import UpdateComment from './update-comment';
import api from '../../api';
import type { CommentType } from '@odinbook/types';
import { AxiosError } from 'axios';

type Props = CommentType & {
	postId: string;
};

export default function Comment({
	postId,
	id,
	createdAt,
	updatedAt,
	content,
	author,
}: Props) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isBeingUpdated, setIsBeingUpdated] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const currentUser = useAuthStore((s) => s.user);
	const navigate = useNavigate();

	async function handleDelete() {
		try {
			setIsPending(true);
			await api.delete(`/posts/${postId}/comments/${id}`);
			setIsModalOpen(false);
			navigate(0);
		} catch (error) {
			if (error instanceof AxiosError) {
				coloredNotification(error.response?.data.toast);
			}
		} finally {
			setIsPending(false);
		}
	}

	return (
		<>
			<div className="p-2">
				<div className="flex gap-1 lg:gap-2 lg:items-center">
					{/* profile picture */}
					<div>
						{!author && (
							<div className="bg-slate-300 dark:bg-slate-800 rounded-full w-[20px] sm:w-[25px] aspect-square"></div>
						)}

						{author && (
							<Link to={`/users/${author.username}`}>
								<div className="bg-sky-500 rounded-full flex items-center justify-center gap-2 w-[20px] sm:w-[25px] aspect-square">
									<span className="text-xs">{author.firstName[0]}</span>
								</div>
							</Link>
						)}
					</div>

					{/* name and username */}
					<div>
						{!author && <p className="text-slate-500">deleted</p>}

						{author && (
							<div className="flex flex-col lg:flex-row lg:gap-2">
								<Link
									to={`/users/${author.username}`}
									className="hover:underline"
								>
									<p className="text-sm font-bold">
										{author.firstName} {author.lastName}
									</p>
								</Link>
								<Link
									to={`/users/${author.username}`}
									className="hover:underline text-slate-500"
								>
									<p className="text-slate-500 text-xs sm:text-sm">
										{author.username}
									</p>
								</Link>
							</div>
						)}
					</div>

					<span className="text-slate-500">·</span>

					{/* dates */}
					<div className="text-slate-500 pt-1 lg:pt-0">
						{createdAt === updatedAt ? (
							<p className="text-xs">
								{DateTime.fromISO(`${createdAt}`).toRelative()}
							</p>
						) : (
							<p className="text-xs">
								Updated {DateTime.fromISO(`${updatedAt}`).toRelative()}
							</p>
						)}
					</div>
				</div>

				{/* content */}
				<div className="py-2 text-slate-800 dark:text-slate-200">
					{isBeingUpdated && (
						<UpdateComment
							postId={postId}
							commentId={id}
							content={content}
							setIsBeingUpdated={setIsBeingUpdated}
						/>
					)}

					{!isBeingUpdated && <p>{content}</p>}
				</div>

				{/* toolbar */}
				<div>
					{/* dialog */}
					{currentUser &&
						currentUser.username === author?.username &&
						!isBeingUpdated && (
							<div onClick={(e) => e.preventDefault()} className="relative">
								<button
									ref={buttonRef}
									onClick={() => setIsDialogOpen(!isDialogOpen)}
									className="w-6 h-6 flex rounded-full items-center justify-center hover:text-sky-600 hover:bg-sky-100 hover:dark:text-sky-300 hover:dark:bg-sky-900 transition-colors"
								>
									<BsThreeDots className="text-slate-800 dark:text-slate-200" />
								</button>

								<Dialog
									isOpen={isDialogOpen}
									setIsOpen={setIsDialogOpen}
									buttonRef={buttonRef}
									className=""
								>
									<button
										onClick={() => {
											setIsBeingUpdated(true);
											setIsDialogOpen(false);
										}}
										className="w-full py-4 px-6 flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
									>
										<FaRegEdit />
										<span>Update</span>
									</button>

									<button
										onClick={() => setIsModalOpen(true)}
										className="w-full py-4 px-6 flex items-center gap-2 hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors"
									>
										<TiDeleteOutline />
										<span>Delete</span>
									</button>
								</Dialog>
							</div>
						)}
				</div>
			</div>

			<Modal isOpen={isModalOpen}>
				<div>
					<h2 className="text-xl my-4">
						Are you sure you want to delete this post?
					</h2>
					<div className="flex gap-2 justify-end">
						<button
							onClick={() => setIsModalOpen(false)}
							disabled={isPending}
							className="bg-sky-400 hover:bg-sky-300 disabled:opacity-60 disabled:hover:bg-sky-400 disabled:cursor-not-allowed py-2 px-4 rounded-full transition-colors"
						>
							Cancel
						</button>

						<button
							onClick={handleDelete}
							disabled={isPending}
							className="bg-rose-500 hover:bg-rose-400 disabled:opacity-60 disabled:hover:bg-rose-500 disabled:cursor-not-allowed py-2 px-4 rounded-full transition-colors"
						>
							Delete
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}

export function CommentSkeleton() {
	return <div>Comment Skeleton</div>;
}
