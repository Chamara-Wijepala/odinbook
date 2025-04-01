import { useState, useEffect } from 'react';
import useData from './useData';
import type { CommentType } from '@odinbook/types';

type Data = {
	nextCursor: number | null;
	comments: CommentType[];
};

export default function useComments(url: string) {
	const [cursor, setCursor] = useState<number>();
	const [comments, setComments] = useState<CommentType[]>([]);
	const { isLoading, data } = useData<Data>(url + `?cursor=${cursor}`);

	function loadMore() {
		if (!data || !data.nextCursor) return;
		setCursor(data.nextCursor);
	}

	useEffect(() => {
		if (!data) return;

		if (data.comments.length > 0) {
			setComments((prev) => [...prev, ...data.comments]);
		}
	}, [data]);

	return { isLoading, comments, loadMore, nextCursor: data?.nextCursor };
}
