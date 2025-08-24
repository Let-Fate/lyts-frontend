import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export interface GetCardResponse {
    question: string;
    spreadName: string;
    cardList: TarotCard[];
    reverseList: boolean[];
    answer: string;
}

interface TarotCard {
    id: number;
    name: string;
    description: string;
    normal: string;
    reversed: string;
    link: string;
}
export const API_URL = "http://localhost:522"