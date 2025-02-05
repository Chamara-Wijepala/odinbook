import { create } from 'zustand';

type NewPostStore = {
	newPostCreated: boolean;
	setNewPost: () => void;
};

const useNewPostStore = create<NewPostStore>((set) => ({
	newPostCreated: false,
	setNewPost: () => {
		set({ newPostCreated: true });
		setTimeout(() => {
			set(() => ({ newPostCreated: false }));
		}, 0);
	},
}));

export default useNewPostStore;
