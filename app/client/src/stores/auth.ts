import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type AuthStore = {
	token: string | null;
	setToken: (token: string) => void;
};

const useAuthStore = create(
	devtools<AuthStore>((set) => ({
		token: null,
		setToken: (token: string) => set(() => ({ token })),
	}))
);

export default useAuthStore;
