import { create, useStore } from "zustand";

export interface AuthStore {
  token: string | null;
  actions: {
    signIn: (token: string) => void;
    signOut: () => void;
  };
}

const initialState: Omit<AuthStore, "actions"> = {
  token: null,
};

const authStore = create<AuthStore>()((set) => ({
  ...initialState,
  actions: {
    signIn: (token) => set({ token }),
    signOut: () => set(initialState),
  },
}));

export const useAuthToken = () => useStore(authStore, (state) => state.token);
export const useIsAuthenticated = () => useStore(authStore, (state) => !!state.token);
export const useAuthActions = () => useStore(authStore, (state) => state.actions);

export const useAuthStore = () => useStore(authStore);

export default authStore;
