import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";

/** TODO: still a bit iffy on the auth types */
type AuthType = "user" | "guest";
type AuthRole = "admin" | "member";

export interface AuthStore {
	token: string | null;
	type: AuthType | null;
	role: AuthRole | null;
	actions: {
		signIn: (
			data: { token: string } & (
				| { type: "guest"; role?: undefined }
				| { type: "user"; role: AuthRole }
			),
		) => void;
		signOut: () => void;
	};
}

const initialState: Omit<AuthStore, "actions"> = {
	token: null,
	type: null,
	role: null,
};

const authStore = create<AuthStore>()(
	persist(
		(set) => ({
			...initialState,
			actions: {
				signIn: ({ token, type, role }) => set({ token, type, role }),
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
export const useAuthType = () => useStore(authStore, (state) => state.type);
export const useAuthRole = () => useStore(authStore, (state) => state.role);
export const useAuthActions = () =>
	useStore(authStore, (state) => state.actions);

export default authStore;
