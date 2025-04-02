import { useEffect, useMemo } from 'react';
import useCommentsStore from '../../stores/comments';
import useComments from '../../hooks/useComments';
import Comment, { CommentSkeleton } from '../../components/comment';

export default function CommentSection({ postId }: { postId: string }) {
	const clearComments = useCommentsStore((s) => s.clearComments);
	const comments = useCommentsStore((s) => s.comments);
	const rootComments = useMemo(
		() => comments.filter((c) => !c.replyToId),
		[comments]
	);
	const { isLoading, loadMore, nextCursor } = useComments(
		`/posts/${postId}/comments`
	);

	useEffect(() => {
		return () => clearComments();
	}, []);

	return (
		<div className="p-2">
			{isLoading && rootComments.length < 1 && (
				<>
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
				</>
			)}

			{rootComments.length > 0 && (
				<>
					{rootComments.map((comment) => (
						<Comment key={comment.id} postId={postId} {...comment} />
					))}

					<div className="flex justify-center">
						<button
							disabled={isLoading}
							onClick={loadMore}
							className={`rounded-full py-2 px-4 w-full font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-300 hover:dark:bg-slate-700 disabled:text-slate-600 disabled:cursor-not-allowed ${
								!nextCursor && 'hidden'
							}`}
						>
							Load more
						</button>
					</div>
				</>
			)}
		</div>
	);
}
