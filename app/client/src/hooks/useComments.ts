import { useState, useEffect } from 'react';
import useCommentsStore from '../stores/comments';
import useData from './useData';
import type { CommentType, ICommentWithReplies } from '@odinbook/types';

type Data = {
	nextCursor: number | null;
	comments: CommentType[] | ICommentWithReplies;
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

		if (Array.isArray(data.comments)) {
			setComments(data.comments);
			return;
		}

		const { replies, ...parentComment } = data.comments;

		setComments([parentComment, ...replies]);
	}, [data]);

	return { isLoading, loadMore, nextCursor: data?.nextCursor };
}
