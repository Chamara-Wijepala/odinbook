import { useState, useEffect, useRef, useMemo, PropsWithChildren } from 'react';
import { Link } from 'react-router';
import { GoPlusCircle } from 'react-icons/go';
import useCommentsStore from '../../stores/comments';
import Comment from '../comment';
import filterDuplicateComments from '../../services/filter-duplicate-comments';
import api from '../../api';
import { CommentType } from '@odinbook/types';

type CommentThreadProps = PropsWithChildren & {
	postId: string;
	comment: CommentType;
	depth: number;
};

export default function CommentThread({
	children,
	postId,
	comment,
	depth,
}: CommentThreadProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const comments = useCommentsStore((s) => s.comments);
	const replies = useMemo(
		() => comments.filter((c) => c.replyToId === comment.id),
		[comments]
	);

	return (
		<div>
			<Comment postId={postId} {...comment} />

			<div className="flex">
				{/* collapse thread button */}
				<button
					onClick={() => setIsExpanded(false)}
					className="min-w-4 flex justify-center group/connector"
				>
					<span className="min-w-[1px] bg-slate-200 group-hover/connector:bg-slate-400 dark:bg-slate-700 dark:group-hover/connector:bg-slate-500"></span>
				</button>

				{/* replies */}
				{isExpanded && (
					<div className="w-full">
						{replies.map((reply) => (
							<CommentThread
								key={reply.id}
								postId={postId}
								comment={reply}
								depth={depth + 1}
							>
								<LoadMore
									postId={postId}
									commentId={reply.id}
									depth={depth + 1}
								/>
							</CommentThread>
						))}
					</div>
				)}

				{/* expand thread button */}
				{!isExpanded && (
					<button
						onClick={() => setIsExpanded(true)}
						className="flex items-center gap-1 lg:gap-2"
					>
						<GoPlusCircle />

						<div>
							{!comment.author && <p className="text-slate-500">deleted</p>}

							{comment.author && (
								<p className="text-sm font-bold">{comment.author.username}</p>
							)}
						</div>
					</button>
				)}
			</div>

			{children}
		</div>
	);
}

function LoadMore({
	postId,
	commentId,
	depth,
}: {
	postId: string;
	commentId: number;
	depth: number;
}) {
	// null is returned by the server when there are no more comments and is used
	// here to hide the load more button
	const [cursor, setCursor] = useState<number | undefined | null>();
	const [isLoading, setIsLoading] = useState(false);
	const comments = useCommentsStore((s) => s.comments);
	const setComments = useCommentsStore((s) => s.setComments);
	const controllerRef = useRef<AbortController>();
	useEffect(() => {
		return () => controllerRef.current?.abort();
	}, []);

	async function getReplies() {
		controllerRef.current = new AbortController();

		setIsLoading(true);
		try {
			const response = await api.get(
				`/posts/${postId}/comments/${commentId}?cursor=${cursor}`,
				{
					signal: controllerRef.current.signal,
				}
			);

			setCursor(response.data.nextCursor);

			if (response.data.comments.length > 0) {
				// there will be comments in the store at this point, so no need to
				// check for comment.length
				setComments(filterDuplicateComments(comments, response.data.comments));
			}
		} catch (err) {
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	}

	return depth === 5 ? (
		// Link to single thread
		<Link
			to={`/post/${postId}/thread/${commentId}`}
			className="flex items-center gap-1 py-1 px-2 rounded-full max-w-fit transition-colors text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-300 hover:dark:bg-slate-700"
		>
			<GoPlusCircle />
			<span>Continue thread</span>
		</Link>
	) : (
		// Load more button
		<button
			onClick={getReplies}
			disabled={isLoading}
			className={`flex items-center gap-1 py-1 px-2 rounded-full transition-colors text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-300 hover:dark:bg-slate-700 ${
				cursor === null && 'hidden'
			}`}
		>
			<GoPlusCircle />
			<span>More replies</span>
		</button>
	);
}

CommentThread.LoadMore = LoadMore;
