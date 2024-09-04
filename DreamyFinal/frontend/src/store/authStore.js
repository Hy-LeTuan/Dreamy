import { create } from "zustand";

const useAuthStore = create((set, get) => ({
	user: null,
	setAuthUser: (newUser) => set({ user: newUser }),
	resetAuthUser: () => set({ user: null }),
	isLoggedIn: () => get((state) => (state.user ? true : false)),
}));

export default useAuthStore;
