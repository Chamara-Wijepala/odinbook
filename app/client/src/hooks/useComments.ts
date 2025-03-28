import { useState, useEffect } from 'react';
import useData from './useData';
import type { CommentType } from '@odinbook/types';

type Data = {
	comments: CommentType[];
};

export default function useComments(url: string) {
	const [comments, setComments] = useState<CommentType[]>([]);
	const { isLoading, data } = useData<Data>(url);

	useEffect(() => {
		if (!data) return;

		if (data.comments.length > 0) {
			setComments((prev) => [...prev, ...data.comments]);
		}
	}, [data]);

	return { isLoading, comments };
}
