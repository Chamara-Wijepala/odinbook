import { useState, useEffect, useRef } from 'react';
import useData from './useData';
import useOnScreen from './useOnScreen';
import { PostType } from '../types';

type Data = {
	nextCursor: string | null;
	posts: PostType[];
};

export default function usePosts(url: string) {
	const [cursor, setCursor] = useState('');
	const [posts, setPosts] = useState<PostType[]>([]);
	const loaderRef = useRef<HTMLDivElement | null>(null);
	const isOnScreen = useOnScreen(loaderRef);
	const { isLoading, data } = useData<Data | null>(url + `&cursor=${cursor}`);

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

	return {
		isLoading,
		posts,
		loaderRef,
	};
}
