import {create} from 'zustand';


interface AuthState {
    token: string | null;
    setToken: (newToken: string) => void;
    clearToken: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    token: "",
    setToken: (newToken: string) => {
        localStorage.setItem("authToken", newToken);
        set({ token: newToken });
    },
    clearToken: () => {
        localStorage.removeItem("authToken");
        set({ token: null });
    }
}));

export default useAuthStore;