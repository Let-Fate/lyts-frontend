import { DateData } from "@/components/DatePicker";
import { create } from "zustand/react";

interface BaziState {
    data: DateData;
    setData(newData: DateData): void;
    gender: string;
    setGender(newGender: string): void;
}
const useBaziStore = create<BaziState>((set) => ({
    data: {
        year: 2000,
        month: 1,
        day: 1,
        hour: 1,
        minute: 1,
    } as DateData,
    setData(newData: DateData) {
        set({ data: newData })
    },
    gender: "男",
    setGender(newGender: string) {
        set({ gender: newGender })
    }
}));
export default useBaziStore;