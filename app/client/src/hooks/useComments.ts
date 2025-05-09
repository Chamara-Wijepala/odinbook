import { useState, useEffect, useRef } from 'react';
import useCommentsStore from '../stores/comments';
import useData from './useData';
import filterDuplicateComments from '../services/filter-duplicate-comments';
import type { CommentType, ICommentWithReplies } from '@odinbook/types';

type Data = {
	nextCursor: number | null;
	comments: CommentType[] | ICommentWithReplies;
};

export default function useComments(url: string, sort: string) {
	const [cursor, setCursor] = useState<number | null>(null);
	const { isLoading, data } = useData<Data>(
		url + `?cursor=${cursor}` + `&sort=${sort}`
	);
	const comments = useCommentsStore((s) => s.comments);
	const setComments = useCommentsStore((s) => s.setComments);
	const clearComments = useCommentsStore((s) => s.clearComments);
	const prevSortRef = useRef<string>(sort);

	function loadMore() {
		if (!data || !data.nextCursor) return;
		setCursor(data.nextCursor);
	}

	// Reset when sort is changed so the new posts can be rendered without reloading the page
	useEffect(() => {
		prevSortRef.current = sort;
		setComments([]);
		setCursor(null);
	}, [sort]);

	useEffect(() => {
		if (!data) return;

		if (Array.isArray(data.comments)) {
			// Clear old comments for newly sorted comments
			if (!cursor) {
				clearComments();
				setComments(data.comments);
				return;
			}

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
