import { create } from 'zustand';

interface UserState {
    phone: string;
    points: points;
    level: string;
    expire: string;
    free: number;
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
    setPhone: (phone: string) => void;
    setPoints: (points: points) => void;
    setLevel: (level: string) => void;
    setExpire: (expire: string) => void;
    setFree: (free: number) => void;
}

interface points {
    reward: number;
    recharge: number;
}

const userStore = create<UserState>((set) => ({
    phone: "",
    points: {
        reward: 0,
        recharge: 0
    },
    level: "",
    expire: "",
    free: 0,
    isLogin: false,
    setFree: (free) => set({ free }),
    setPhone: (phone) => set({ phone }),
    setPoints: (points) => set({ points }),
    setLevel: (level) => set({ level }),
    setExpire: (expire) => set({ expire }),
    setIsLogin: (isLogin) => set({ isLogin }),
}));

export default userStore;