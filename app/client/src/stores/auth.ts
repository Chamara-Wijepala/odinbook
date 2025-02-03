import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type AuthStore = {
	token: string | null;
	setToken: (token: string) => void;
	clearToken: () => void;
};

const useAuthStore = create(
	devtools<AuthStore>((set) => ({
		token: null,
		setToken: (token: string) => set(() => ({ token })),
		clearToken: () => set(() => ({ token: null })),
	}))
);

export default useAuthStore;
