import { useState, useEffect } from 'react';
import useCommentsStore from '../stores/comments';
import useData from './useData';
import filterDuplicateComments from '../services/filter-duplicate-comments';
import type { CommentType, ICommentWithReplies } from '@odinbook/types';

type Data = {
	nextCursor: number | null;
	comments: CommentType[] | ICommentWithReplies;
};

export default function useComments(url: string) {
	const [cursor, setCursor] = useState<number>();
	const { isLoading, data } = useData<Data>(url + `?cursor=${cursor}`);
	const comments = useCommentsStore((s) => s.comments);
	const setComments = useCommentsStore((s) => s.setComments);

	function loadMore() {
		if (!data || !data.nextCursor) return;
		setCursor(data.nextCursor);
	}

	useEffect(() => {
		if (!data) return;

		if (Array.isArray(data.comments)) {
			if (comments.length > 0) {
				setComments(filterDuplicateComments(comments, data.comments));
			} else {
				setComments(data.comments);
			}
			return;
		}

		const { replies, ...parentComment } = data.comments;

		if (comments.length > 0) {
			setComments(
				filterDuplicateComments(comments, [parentComment, ...replies])
			);
			return;
		}

		setComments([parentComment, ...replies]);
	}, [data]);

	return { isLoading, loadMore, nextCursor: data?.nextCursor };
}
