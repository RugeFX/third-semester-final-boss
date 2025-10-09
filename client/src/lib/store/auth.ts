import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";

/** TODO: still a bit iffy on the auth types */
type AuthType = "user" | "guest";

export interface AuthStore {
	token: string | null;
	type: AuthType | null;
	actions: {
		signIn: (token: string, type: AuthType) => void;
		signOut: () => void;
	};
}

const initialState: Omit<AuthStore, "actions"> = {
	token: null,
	type: null,
};

const authStore = create<AuthStore>()(
	persist(
		(set) => ({
			...initialState,
			actions: {
				signIn: (token, type) => set({ token, type }),
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
export const useAuthActions = () =>
	useStore(authStore, (state) => state.actions);

export default authStore;
