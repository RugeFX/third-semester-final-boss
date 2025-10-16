import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "member";
export type User =
	| {
			type: "user";
			role: Role;
	  }
	| {
			type: "guest";
			role?: undefined;
	  };

export interface AuthStore {
	token: string | null;
	user: User | null;
	actions: {
		signInAsUser: (token: string, role: Role) => void;
		signInAsGuest: (accessCode: string) => void;
		signOut: () => void;
	};
}

const initialState: Omit<AuthStore, "actions"> = {
	token: null,
	user: null,
};

const authStore = create<AuthStore>()(
	persist(
		(set) => ({
			...initialState,
			actions: {
				signInAsUser: (token, role) =>
					set({ token, user: { type: "user", role } }),
				signInAsGuest: (accessCode) =>
					set({ token: accessCode, user: { type: "guest" } }),
				signOut: () => set(initialState),
			},
		}),
		{
			name: "auth",
			partialize: ({ actions, ...state }) => state,
		},
	),
);

export const useAuthToken = () => useStore(authStore, (state) => state.token);
export const useIsAuthenticated = () =>
	useStore(authStore, (state) => !!state.token);
export const useAuthUser = () => useStore(authStore, (state) => state.user);
export const useAuthActions = () =>
	useStore(authStore, (state) => state.actions);

export default authStore;
