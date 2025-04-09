import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router';
import { DateTime } from 'luxon';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaRegComment } from 'react-icons/fa';
import Dialog from '../../components/dialog';
import PostDialogItems from '../../components/post/post-dialog-items';
import PostLikes from '../../components/post-likes';
import BackButton from '../../components/back-button';
import CreateComment from '../../components/create-comment';
import CommentSection from './comment-section';
import SingleThread from './single-thread';
import PostSkeleton from './post-skeleton';
import useData from '../../hooks/useData';
import coloredNotification from '../../services/notifications';
import type { PostType } from '../../types';
import { AxiosError } from 'axios';

function formatDate(isoString: string) {
	const dt = DateTime.fromISO(isoString);
	const time = dt.toFormat('h:mm a');
	const date = dt.toFormat('MMM d, yyyy');

	return `${time} · ${date}`;
}

export default function PostPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const params = useParams();
	const {
		isLoading,
		data: post,
		error,
	} = useData<PostType>(`/posts/${params.postId}`);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!error) return;

		if (error instanceof AxiosError) {
			const { toast } = error.response?.data;

			coloredNotification(toast);
			navigate('/');
		}
	}, [error]);

	return (
		<div>
			<div className="p-4">
				<BackButton />
			</div>

			{isLoading && <PostSkeleton />}

			{!isLoading && post && (
				<>
					<div className="border-b-[1px] border-slate-300 dark:border-slate-800">
						<div className="p-4">
							<div className="flex gap-2">
								{/* profile */}
								<div>
									<Link to={`/users/${post.author.username}`}>
										<div className="bg-sky-500 rounded-full flex items-center justify-center gap-2 w-[40px] sm:w-[50px] aspect-square">
											<span>{post.author.firstName[0]}</span>
										</div>
									</Link>
								</div>

								{/* names and username */}
								<div className="text-sm sm:text-base flex flex-col flex-grow gap-x-1 h-fit">
									<div className="font-semibold flex flex-wrap gap-1">
										<Link
											to={`/users/${post.author.username}`}
											className="hover:underline"
										>
											<p>
												{post.author.firstName} {post.author.lastName}
											</p>
										</Link>
									</div>
									<Link
										to={`/users/${post.author.username}`}
										className="hover:underline decoration-slate-500"
									>
										<p className="text-slate-500 text-xs sm:text-sm">
											@{post.author.username}
										</p>
									</Link>
								</div>

								{/* dialog */}
								<div className="relative">
									<button
										ref={buttonRef}
										onClick={() => setIsDialogOpen(!isDialogOpen)}
										className="w-6 h-6 flex rounded-full items-center justify-center hover:text-sky-600 hover:bg-sky-100 hover:dark:text-sky-300 hover:dark:bg-sky-900 transition-colors"
									>
										<BsThreeDotsVertical />
									</button>

									<Dialog
										isOpen={isDialogOpen}
										setIsOpen={setIsDialogOpen}
										buttonRef={buttonRef}
										className="-translate-x-[calc(100%-20px)]"
									>
										<PostDialogItems
											authorId={post.author.id}
											postId={post.id}
											postContent={post.content}
										/>
									</Dialog>
								</div>
							</div>

							{/* content */}
							<div className="my-4">
								<p className="break-all">{post.content}</p>
							</div>

							{/* dates */}
							<div className="flex flex-wrap gap-1 text-sm lg:text-base text-wrap">
								<p className="text-slate-500">{formatDate(post.createdAt)}</p>
								{post.createdAt !== post.updatedAt && (
									<p className="text-slate-500">
										· Updated {formatDate(post.updatedAt)}
									</p>
								)}
							</div>
						</div>

						{/* likes */}
						<div className="p-4">
							<div className="flex gap-2 pt-4 border-t-[1px] border-slate-300 dark:border-slate-800">
								<PostLikes likedBy={post.likedBy} postId={post.id} />

								<div className="flex items-center gap-2 py-1 px-3 rounded-full text-slate-500">
									<p>{post._count.comments}</p>
									<FaRegComment className="w-5 h-5" />
								</div>
							</div>
						</div>
					</div>

					{/* create comment */}
					<div className="p-4 border-b-[1px] border-slate-300 dark:border-slate-800">
						<CreateComment url={`/posts/${post.id}/comments`} />
					</div>

					{/* comments */}
					{location.pathname.split('thread').length === 2 ? ( // will split the string in two if 'thread' exists
						<SingleThread
							postId={post.id}
							commentId={Number(location.pathname.split('/').at(-1))}
						/>
					) : (
						<CommentSection postId={post.id} />
					)}
				</>
			)}
		</div>
	);
}
