export type Yao = 0 | 1 | 2 | 3;
export type Hexagram = Yao[];

export interface YaoDetail {
    yao: '--' | '—';
    gan: string;
    wuxing: string;
    liuqin: string;
    liushou: string;
    shiying: string;
}

export interface HexagramData {
    name: string;
    yao: YaoDetail['yao'][];
    gan: string[];
    wuxing: string[];
    liuqin: string[];
    liushou: string[];
    shiying: string[];
}

export interface DivinationResult {
    bazi: string[];
    xunkong: string[];
    ben: HexagramData;
    bian: HexagramData;
    dong: string[];
}

export function castYao(): Yao {
    return Math.floor(Math.random() * 4) as Yao;
}

export function getWuXingColor(wuxing: string): string {
    const colorMap: Record<string, string> = {
        '木': 'green-500',
        '火': 'red-500',
        '土': 'black',
        '金': 'yellow-500',
        '水': 'blue-500'
    };
    return colorMap[wuxing] || 'gray-500';
}

export function isYin(yao: Yao | '--' | '—'): boolean {
    return yao === 1 || yao === 3 || yao === '--';
}

export function isChanging(yao: Yao): boolean {
    return yao === 2 || yao === 3;
}

export function yaoToString(yao: Yao): '--' | '—' {
    return isYin(yao) ? '--' : '—';
}

