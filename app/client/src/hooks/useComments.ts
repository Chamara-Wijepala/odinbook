import { useState, useEffect } from 'react';
import useCommentsStore from '../stores/comments';
import useData from './useData';
import type { CommentType } from '@odinbook/types';

type Data = {
	nextCursor: number | null;
	comments: CommentType[];
};

export default function useComments(url: string) {
	const [cursor, setCursor] = useState<number>();
	const { isLoading, data } = useData<Data>(url + `?cursor=${cursor}`);
	const setComments = useCommentsStore((s) => s.setComments);

	function loadMore() {
		if (!data || !data.nextCursor) return;
		setCursor(data.nextCursor);
	}

	useEffect(() => {
		if (!data) return;

		if (data.comments.length > 0) {
			setComments(data.comments);
		}
	}, [data]);

	return { isLoading, loadMore, nextCursor: data?.nextCursor };
}
