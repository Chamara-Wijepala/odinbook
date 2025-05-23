import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import useCommentsStore from '../../stores/comments';
import useComments from '../../hooks/useComments';
import CommentSkeleton from '../../components/comment/comment-skeleton';
import CommentThread from '../../components/comment-thread';

export default function SingleThread({
	postId,
	postAuthor,
	commentId,
}: {
	postId: string;
	postAuthor: string;
	commentId: number;
}) {
	const clearComments = useCommentsStore((s) => s.clearComments);
	const comments = useCommentsStore((s) => s.comments);
	const threadParent = useMemo(
		() => comments.filter((c) => c.id === commentId),
		[comments]
	);
	const { isLoading } = useComments(
		`/posts/${postId}/comments/${commentId}/thread`
	);
	const navigate = useNavigate();
	const location = useLocation();

	// fixes the issue with the more replies button being rendered when going back
	// on a single thread.
	useEffect(() => {
		clearComments();
	}, [location.pathname]);

	useEffect(() => {
		return () => clearComments();
	}, []);

	return (
		<div className="p-2">
			<div className="flex justify-between p-2 text-sm text-slate-700 dark:text-slate-300">
				<button
					onClick={() => navigate(-1)}
					className="hover:underline hover:text-slate-950 dark:hover:text-slate-100"
				>
					Go back
				</button>

				<Link
					to={`/post/${postId}`}
					className="hover:underline hover:text-slate-950 dark:hover:text-slate-100"
				>
					See full discussion
				</Link>
			</div>

			{isLoading && threadParent.length < 1 && (
				<>
					<CommentSkeleton />

					<div className="flex">
						<div className="min-w-4 flex justify-center">
							<span className="min-w-[1px] bg-slate-300 dark:bg-slate-800 animate-pulse"></span>
						</div>

						<div className="w-full">
							<CommentSkeleton />
							<CommentSkeleton />
						</div>
					</div>
				</>
			)}

			{threadParent.length > 0 && (
				<div className="flex flex-col gap-2 mb-2">
					<CommentThread
						postId={postId}
						postAuthor={postAuthor}
						comment={threadParent[0]}
						depth={1}
					/>
				</div>
			)}
		</div>
	);
}
