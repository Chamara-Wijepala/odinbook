import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CommentType } from '@odinbook/types';

const enabled = import.meta.env.MODE === 'production' ? false : true;

type CommentsStore = {
	comments: CommentType[];
	setComments: (newComments: CommentType[]) => void;
	clearComments: () => void;
};

const useCommentsStore = create(
	devtools<CommentsStore>(
		(set) => ({
			comments: [],

			setComments: (newComments: CommentType[]) => {
				set((state) => ({ comments: [...state.comments, ...newComments] }));
			},

			clearComments: () => set(() => ({ comments: [] })),
		}),
		{ name: 'Comments Store', enabled }
	)
);

export default useCommentsStore;
