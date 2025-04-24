import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { DateTime } from 'luxon';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegEdit, FaRegComment, FaCommentSlash } from 'react-icons/fa';
import { TiDeleteOutline } from 'react-icons/ti';
import useAuthStore from '../../stores/auth';
import useCommentsStore from '../../stores/comments';
import coloredNotification from '../../services/notifications';
import Dialog from '../dialog';
import Modal from '../modal';
import DefaultAvatar from '../default-avatar';
import UpdateComment from './update-comment';
import CommentLike from './like';
import Reply from './reply';
import api from '../../api';
import type { CommentType } from '@odinbook/types';
import { AxiosError } from 'axios';

type Props = CommentType & {
	postId: string;
	postAuthor: string;
};

export default function Comment({
	postId,
	postAuthor,
	id,
	createdAt,
	updatedAt,
	content,
	author,
	likes,
}: Props) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isBeingUpdated, setIsBeingUpdated] = useState(false);
	const [isBeingRepliedTo, setIsBeingRepliedTo] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const currentUser = useAuthStore((s) => s.user);
	const updateComment = useCommentsStore((s) => s.updateComment);

	async function handleDelete() {
		try {
			setIsPending(true);
			const response = await api.delete(`/posts/${postId}/comments/${id}`);
			updateComment(response.data.comment);
			setIsModalOpen(false);
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
								<div className="rounded-full flex items-center justify-center gap-2 w-[20px] sm:w-[25px] aspect-square overflow-hidden">
									{author.avatar ? (
										<img src={author.avatar.url} alt={author.username} />
									) : (
										<DefaultAvatar />
									)}
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
									<p
										className={`text-sm font-bold ${
											author.username === currentUser?.username &&
											'!text-amber-600 !dark:text-amber-400'
										} ${
											postAuthor === author.username &&
											'text-emerald-600 dark:text-emerald-400'
										}`}
									>
										{author.firstName} {author.lastName}
									</p>
								</Link>
								<Link
									to={`/users/${author.username}`}
									className="hover:underline text-slate-500"
								>
									<p className="text-slate-500 text-xs sm:text-sm">
										@{author.username}
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
								{author ? 'Updated' : 'Deleted'}{' '}
								{DateTime.fromISO(`${updatedAt}`).toRelative()}
							</p>
						)}
					</div>
				</div>

				{/* content */}
				<div className="py-2 text-slate-800 dark:text-slate-200">
					{isBeingUpdated && content && (
						<UpdateComment
							url={`/posts/${postId}/comments/${id}`}
							content={content}
							setIsBeingUpdated={setIsBeingUpdated}
						/>
					)}

					{!isBeingUpdated && (
						<p className="break-all">
							{content ? (
								content
							) : (
								<span className="text-slate-500">comment deleted</span>
							)}
						</p>
					)}
				</div>

				{/* toolbar */}
				<div className="flex items-center gap-1">
					{/* like button */}
					<CommentLike
						likesLength={likes.length}
						isLiked={
							likes.find((l) => l.userId === currentUser?.id) ? true : false
						}
						postId={postId}
						commentId={id}
						disabled={!author}
					/>

					{/* reply button */}
					<button
						disabled={!author}
						onClick={() => setIsBeingRepliedTo((prev) => !prev)}
						className={`flex items-center gap-1 py-1 px-2 rounded-full transition-colors disabled:cursor-default disabled:text-slate-500 disabled:hover:bg-transparent ${
							isBeingRepliedTo
								? 'text-rose-400 hover:bg-rose-200 hover:dark:bg-rose-950'
								: 'text-slate-800 dark:text-slate-200 hover:bg-slate-300 hover:dark:bg-slate-700'
						}`}
					>
						{isBeingRepliedTo ? <FaCommentSlash /> : <FaRegComment />}
						<span className="text-sm font-bold">Reply</span>
					</button>

					{/* dialog */}
					{currentUser && currentUser.username === author?.username && (
						<div onClick={(e) => e.preventDefault()} className="relative">
							<button
								ref={buttonRef}
								onClick={() => setIsDialogOpen(!isDialogOpen)}
								disabled={isBeingUpdated || isBeingRepliedTo}
								className="w-6 h-6 flex rounded-full items-center justify-center hover:text-sky-600 hover:bg-sky-100 hover:dark:text-sky-300 hover:dark:bg-sky-900 transition-colors group/dialog"
							>
								<BsThreeDots className="text-slate-800 dark:text-slate-200 group-disabled/dialog:text-slate-400" />
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
									className="w-full py-4 px-6 flex items-center gap-2 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
								>
									<FaRegEdit />
									<span>Update</span>
								</button>

								<button
									onClick={() => setIsModalOpen(true)}
									className="w-full py-4 px-6 flex items-center gap-2 font-bold hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors"
								>
									<TiDeleteOutline />
									<span>Delete</span>
								</button>
							</Dialog>
						</div>
					)}
				</div>

				{isBeingRepliedTo && (
					<div className="mt-2">
						<Reply
							url={`/posts/${postId}/comments/${id}`}
							setIsBeingRepliedTo={setIsBeingRepliedTo}
						/>
					</div>
				)}
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
