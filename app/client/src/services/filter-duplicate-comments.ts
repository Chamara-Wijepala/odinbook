import { CommentType } from '@odinbook/types';

export default function filterDuplicateComments(
	store: CommentType[],
	fetched: CommentType[]
) {
	const result: CommentType[] = [];
	for (let i = 0; i < fetched.length; i++) {
		const found = store.find((comment) => comment.id === fetched[i].id);
		if (!found) result.push(fetched[i]);
	}
	return result;
}
