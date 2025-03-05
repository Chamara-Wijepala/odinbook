import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import CreatePost from '../../components/create-post';
import Post, { PostSkeleton } from '../../components/post';
import useAuthStore from '../../stores/auth';
import useNewPostStore from '../../stores/new-post';
import useData from '../../hooks/useData';
import useOnScreen from '../../hooks/useOnScreen';
import { PostType } from '../../types';

type Data = {
	nextCursor: string | null;
	posts: PostType[];
};

export default function UserPosts({ id }: { id: string }) {
	const [cursor, setCursor] = useState('');
	const { isLoading, data } = useData<Data>(
		`/posts?userId=${id}&cursor=${cursor}`
	);
	const params = useParams();
	const currentUser = useAuthStore((state) => state.user);
	const newPost = useNewPostStore((state) => state.newPost);
	const [newPosts, setNewPosts] = useState<PostType[]>([]);
	const [posts, setPosts] = useState<PostType[]>([]);
	const loaderRef = useRef<HTMLDivElement>(null);
	const isOnScreen = useOnScreen(loaderRef);

	useEffect(() => {
		if (newPost) setNewPosts((prev) => [newPost, ...prev]);
	}, [newPost]);

	useEffect(() => {
		if (!data) return;

		if (data.posts.length > 0) setPosts((prev) => [...prev, ...data.posts]);

		// loaderRef element must be in the DOM because it's passed to useOnScreen,
		// so it's hidden instead.
		// explicitly check for null because server returns null when there are no
		// more posts to return.
		if (data.nextCursor === null) loaderRef.current!.className = 'hidden';
	}, [data]);

	// setting cursor also causes useData to refetch
	useEffect(() => {
		if (!data || !data.nextCursor) return;

		if (isOnScreen) {
			setCursor(data.nextCursor);
		}
	}, [isOnScreen]);

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
							likedBy={post.likedBy}
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
						content={post.content}
						createdAt={post.createdAt}
						updatedAt={post.updatedAt}
						likedBy={post.likedBy}
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
