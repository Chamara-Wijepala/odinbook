import Comment, { CommentSkeleton } from '../../components/comment';
import useComments from '../../hooks/useComments';

export default function CommentSection({ postId }: { postId: string }) {
	const { isLoading, comments } = useComments(`/posts/${postId}/comments`);

	return (
		<div>
			{isLoading && (
				<>
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
				</>
			)}

			{!isLoading &&
				comments.map((comment) => (
					<Comment key={comment.id} postId={postId} {...comment} />
				))}
		</div>
	);
}
