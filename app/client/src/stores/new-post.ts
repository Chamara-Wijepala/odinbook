import { create } from 'zustand';
import type { PostType } from '../types';

type NewPostStore = {
	newPost: PostType | null;
	newPostCreated: boolean;
	setNewPost: (newPost: PostType) => void;
};

const useNewPostStore = create<NewPostStore>((set) => ({
	newPost: null,
	newPostCreated: false,
	// Stores and removes newly created post. Used to close the modal and display
	// new post on homepage. The new post is removed so it's only rendered when
	// user creates a post while on the homepage.
	setNewPost: (newPost) => {
		set({ newPost, newPostCreated: true });
		setTimeout(() => {
			set(() => ({ newPost: null, newPostCreated: false }));
		}, 0);
	},
}));

export default useNewPostStore;
