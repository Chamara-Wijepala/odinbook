import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../stores/auth';
import useNewPostStore from '../../stores/new-post';
import CreatePost from '../../components/create-post';
import Post, { PostSkeleton } from '../../components/post';
import { PostType } from '../../types';
import useData from '../../hooks/useData';
import useOnScreen from '../../hooks/useOnScreen';

type Data = {
	nextCursor: string | null;
	posts: PostType[];
};

export default function Home() {
	const newPost = useNewPostStore((state) => state.newPost);
	const currentUser = useAuthStore((state) => state.user);
	const [cursor, setCursor] = useState('');
	const { isLoading, data } = useData<Data>(
		`/posts?page=home&cursor=${cursor}`
	);
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
		<div className="flex flex-col">
			<div className="p-4 border-b-[1px] bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800">
				<CreatePost />
			</div>

			<div className="p-4">
				{/* displays newly created posts by current user */}
				<div className="flex flex-col gap-4">
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

				{/* display posts from users followed by current user */}
				<div className="mt-4">
					{isLoading && (
						<div className="p-4 flex flex-col gap-4">
							<PostSkeleton />
							<PostSkeleton />
							<PostSkeleton />
							<PostSkeleton />
							<PostSkeleton />
						</div>
					)}

					{posts && posts.length < 1 && !isLoading && (
						<div className="text-center p-4 pt-8">
							<p className="text-lg text-slate-500">
								Looks like there's nothing on your feed. Follow some users to
								get updates.
							</p>
						</div>
					)}

					<div className="flex flex-col gap-4">
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

					<div ref={loaderRef} className="pt-4 flex flex-col gap-4">
						<PostSkeleton />
						<PostSkeleton />
						<PostSkeleton />
						<PostSkeleton />
						<PostSkeleton />
					</div>
				</div>
			</div>
		</div>
	);
}
