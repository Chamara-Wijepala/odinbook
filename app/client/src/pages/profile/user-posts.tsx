import { useParams } from 'react-router';
import CreatePost from '../../components/create-post';
import Post, { PostSkeleton } from '../../components/post';
import useAuthStore from '../../stores/auth';
import usePosts from '../../hooks/usePosts';
import useNewPosts from '../../hooks/useNewPosts';

export default function UserPosts({ id }: { id: string }) {
	const params = useParams();
	const currentUser = useAuthStore((state) => state.user);
	const { newPosts } = useNewPosts();
	const { isLoading, posts, loaderRef } = usePosts(`/posts?userId=${id}`);

	return (
		<div className="pb-4">
			{/* skeleton loaders */}
			{isLoading && (
				<div className="p-4 flex flex-col gap-4">
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}

			{/* create post form */}
			{params.username === currentUser?.username && (
				<div className="p-4 border-b-[1px] border-slate-300 dark:border-slate-800">
					<CreatePost />
				</div>
			)}

			{/* message if user doesn't have any posts */}
			{posts && posts.length < 1 && newPosts.length < 1 && !isLoading && (
				<div className="text-center p-4 pt-8">
					<p className="text-lg text-slate-500">
						{params.username === currentUser?.username
							? "You haven't made any posts yet."
							: "This user hasn't made any posts yet."}
					</p>
				</div>
			)}

			{/* displays newly created posts by current user */}
			<div className="pt-4 px-4 flex flex-col gap-4">
				{newPosts.map((post) => (
					<Post
						key={post.id}
						postId={post.id}
						authorId={post.author.id}
						firstName={post.author.firstName}
						lastName={post.author.lastName}
						username={post.author.username}
						// replace url from fetched user for the one in auth store to
						// display the updated avatar without reloading
						avatar={
							currentUser?.avatar
								? { url: currentUser.avatar.url }
								: post.author.avatar
						}
						content={post.content}
						createdAt={post.createdAt}
						updatedAt={post.updatedAt}
						likedBy={post.likedBy}
						commentCount={post._count.comments}
					/>
				))}
			</div>

			{/* user's posts */}
			<div className="pt-4 px-4 flex flex-col gap-4">
				{posts?.map((post) => (
					<Post
						key={post.id}
						postId={post.id}
						authorId={post.author.id}
						firstName={post.author.firstName}
						lastName={post.author.lastName}
						username={post.author.username}
						// replace url from fetched user for the one in auth store to
						// display the updated avatar without reloading
						avatar={
							currentUser?.avatar
								? { url: currentUser.avatar.url }
								: post.author.avatar
						}
						content={post.content}
						createdAt={post.createdAt}
						updatedAt={post.updatedAt}
						likedBy={post.likedBy}
						commentCount={post._count.comments}
					/>
				))}
			</div>

			{/* loads new posts */}
			<div ref={loaderRef} className="p-4 flex flex-col gap-4">
				<PostSkeleton />
				<PostSkeleton />
				<PostSkeleton />
				<PostSkeleton />
				<PostSkeleton />
			</div>
		</div>
	);
}
