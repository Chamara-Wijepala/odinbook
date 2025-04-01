import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const enabled = import.meta.env.MODE === 'production' ? false : true;

type User = {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	following: string[];
};

type AuthStore = {
	token: string | null;
	user: User | null;
	setToken: (token: string) => void;
	clearToken: () => void;
	setUser: (user: User) => void;
	updateUserFollowing: (id: string) => void;
	deleteUserFollowing: (id: string) => void;
};

const useAuthStore = create(
	devtools<AuthStore>(
		(set) => ({
			token: null,
			user: null,
			setToken: (token: string) => set(() => ({ token })),
			clearToken: () => set(() => ({ token: null })),
			setUser: (user: User) => set(() => ({ user })),
			updateUserFollowing: (id) =>
				set((state) => {
					if (!state.user) return state;

					return {
						...state,
						user: {
							...state.user,
							following: [...state.user?.following, id],
						},
					};
				}),
			deleteUserFollowing: (idToRemove) =>
				set((state) => {
					if (!state.user) return state;

					return {
						...state,
						user: {
							...state.user,
							following: state.user.following.filter((id) => id !== idToRemove),
						},
					};
				}),
		}),
		{ name: 'Auth Store', enabled }
	)
);

export default useAuthStore;
