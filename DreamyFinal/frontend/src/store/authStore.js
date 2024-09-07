import { create } from "zustand";

const useAuthStore = create((set, get) => ({
	user: null,
	isLoggedIn: false,
	setAuthUser: (newUser) => set({ user: newUser, isLoggedIn: true }),
	resetAuthUser: () => set({ user: null, isLoggedIn: false }),
}));

export default useAuthStore;
