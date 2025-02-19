import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import CreatePost from '../../components/create-post';
import Post, { PostSkeleton } from '../../components/post';
import useAuthStore from '../../stores/auth';
import useNewPostStore from '../../stores/new-post';
import useData from '../../hooks/useData';
import { PostType } from '../../types';

export default function UserPosts({ id }: { id: string }) {
	const { isLoading, data: posts } = useData<PostType[]>(`/posts?userId=${id}`);
	const params = useParams();
	const currentUser = useAuthStore((state) => state.user);
	const newPost = useNewPostStore((state) => state.newPost);
	const [newPosts, setNewPosts] = useState<PostType[]>([]);

	useEffect(() => {
		if (newPost) setNewPosts((prev) => [newPost, ...prev]);
	}, [newPost]);

	return (
		<div>
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
				{currentUser &&
					newPosts.map((post) => (
						<Post
							key={post.id}
							postId={post.id}
							authorId={currentUser.id}
							firstName={currentUser.firstName}
							lastName={currentUser.lastName}
							username={currentUser.username}
							content={post.content}
							createdAt={post.createdAt}
							updatedAt={post.updatedAt}
						/>
					))}
			</div>

			{/* user's posts */}
			<div className="p-4 flex flex-col gap-4">
				{posts?.map((post) => (
					<Post
						key={post.id}
						postId={post.id}
						authorId={post.author.id}
						firstName={post.author.firstName}
						lastName={post.author.lastName}
						username={post.author.username}
						content={post.content}
						createdAt={post.createdAt}
						updatedAt={post.updatedAt}
					/>
				))}
			</div>
		</div>
	);
}
