import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CommentType } from '@odinbook/types';

const enabled = import.meta.env.MODE === 'production' ? false : true;

type CommentsStore = {
	comments: CommentType[];
	setComments: (newComments: CommentType[]) => void;
	updateComment: (newComment: CommentType) => void;
	clearComments: () => void;
};

const useCommentsStore = create(
	devtools<CommentsStore>(
		(set, get) => ({
			comments: [],

			setComments: (newComments: CommentType[]) => {
				set((state) => ({ comments: [...state.comments, ...newComments] }));
			},

			updateComment: (newComment) => {
				const { comments } = get();
				const updated = comments.map((comment) => {
					if (comment.id === newComment.id) return newComment;
					return comment;
				});
				set(() => ({ comments: updated }));
			},

			clearComments: () => set(() => ({ comments: [] })),
		}),
		{ name: 'Comments Store', enabled }
	)
);

export default useCommentsStore;
