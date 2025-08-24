'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import {
    Yao,
    DivinationResult,
    HexagramData,
    castYao,
    getWuXingColor,
    isYin,
    isChanging
} from './iching-utils.ts';
import { API_URL } from "@/lib/utils";

const IChing: React.FC = () => {
    const [tempYaos, setTempYaos] = useState<Yao[]>([]);
    const [clickCount, setClickCount] = useState(0);
    const [divinationResult, setDivinationResult] = useState<DivinationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const castNextYao = async () => {
        const newYao = castYao();
        const newYaos = [newYao, ...tempYaos];
        setTempYaos(newYaos);
        setClickCount(prev => prev + 1);

        if (clickCount === 5) {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL + '/tool/liuyao/arrange', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ``,
                    },
                    body: JSON.stringify({ data: newYaos })
                });
                const result = await response.json();
                const data = result.data as DivinationResult;
                console.log(data)
                data.ben.gan.reverse();
                data.ben.wuxing.reverse();
                data.ben.liuqin.reverse();
                data.ben.liushou.reverse();
                data.ben.shiying.reverse();
                data.ben.yao.reverse();
                data.bian.gan.reverse();
                data.bian.wuxing.reverse();
                data.bian.liuqin.reverse();
                data.bian.liushou.reverse();
                data.bian.shiying.reverse();
                data.bian.yao.reverse();
                console.log(data)
                setDivinationResult(data);
            } catch (error) {
                console.error('Failed to get divination result:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const resetDivination = () => {
        setTempYaos([]);
        setClickCount(0);
        setDivinationResult(null);
    };

    const renderTempYao = (yao: Yao) => {
        const yin = isYin(yao);
        const changing = isChanging(yao);

        return (
            <div className="flex items-center justify-center w-full my-1">
                <div className="flex items-center">
                    <div className={`relative w-12 sm:w-16 h-6 bg-white rounded flex items-center justify-center`}>
                        {yin ? (
                            <>
                                <div className={`absolute left-0 w-[45%] h-2 bg-gray-600 rounded`}></div>
                                <div className={`absolute right-0 w-[45%] h-2 bg-gray-600 rounded`}></div>
                            </>
                        ) : (
                            <div className={`w-full h-2 bg-gray-600 rounded`}></div>
                        )}
                        {changing && (
                            <div className={`absolute right-0 top-0 text-gray-600 text-xs`}>
                                {yao === 0 ? 'o' : 'x'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderFullYao = (hexagram: HexagramData, index: number, dong: string) => {
        const yao = hexagram.yao[index];
        const gan = hexagram.gan[index];
        const wuxing = hexagram.wuxing[index];
        const liuqin = hexagram.liuqin[index];
        const liushou = hexagram.liushou[index];
        const shiying = hexagram.shiying[index];
        const wuxingColor = getWuXingColor(wuxing);
        const yin = isYin(yao);
        const changing = dong === '×';

        return (
            <div className="flex items-center justify-center w-full my-1">
                <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs whitespace-nowrap">
                    <span>{liuqin}</span>
                    <span>{liushou}</span>
                    <span>{gan}</span>
                    {shiying && (
                        <div className={"bg-gray-300"}>
                            {shiying}
                        </div>
                    )}
                    <div className={`relative w-12 sm:w-16 h-6 bg-white rounded flex items-center justify-center`}>
                        {yin ? (
                            <>
                                <div className={`absolute left-0 w-[45%] h-2 bg-${wuxingColor} rounded`}></div>
                                <div className={`absolute right-0 w-[45%] h-2 bg-${wuxingColor} rounded`}></div>
                            </>
                        ) : (
                            <div className={`w-full h-2 bg-${wuxingColor} rounded`}></div>
                        )}
                        {changing && (
                            <div className={`absolute right-0 top-0 text-${wuxingColor} text-xs`}>
                                ×
                            </div>
                        )}
                    </div>
                    {changing && (
                        <div className="ml-0.5">
                            <ArrowRight className="text-blue-500 w-2 h-2 sm:w-3 sm:h-3" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex justify-center bg-gray-100 p-2 sm:p-4">
            <Card className="w-full max-w-2xl">
                <CardContent className="px-2 sm:px-6 mt-4">
                    {divinationResult && (
                        <div className="mb-4 text-center">
                            <p className="text-sm font-semibold">八字: {divinationResult.bazi.join(' ')}</p>
                            <p className="text-sm font-semibold">旬空: {divinationResult.xunkong.join(' ')}</p>
                        </div>
                    )}
                    <div className="flex flex-row justify-between space-x-2 sm:space-x-4">
                        <div className="flex-1 flex flex-col items-center">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
                                {divinationResult ? `本卦: ${divinationResult.ben.name}` : '本卦'}
                            </h3>
                            <div className="mb-6 space-y-2 flex flex-col items-center w-full">
                                {divinationResult ? (
                                    divinationResult.ben.yao.map((_, index) => renderFullYao(divinationResult.ben, index, divinationResult.dong[index]))
                                ) : (
                                    [...Array(6)].map((_, index) => (
                                        <div key={`empty-${index}`}>
                                            {index < tempYaos.length ? (
                                                renderTempYao(tempYaos[index])
                                            ) : (
                                                <div className="h-8 w-full border border-dashed border-gray-300"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
                                {divinationResult ? `变卦: ${divinationResult.bian.name}` : '变卦'}
                            </h3>
                            <div className="mb-6 space-y-2 flex flex-col items-center w-full">
                                {divinationResult ? (
                                    divinationResult.bian.yao.map((_, index) => renderFullYao(divinationResult.bian, index, ''))
                                ) : (
                                    [...Array(6)].map((_, index) => (
                                        <div key={`empty-changed-${index}`}
                                            className="h-8 w-full border border-dashed border-gray-300"></div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={divinationResult ? resetDivination : castNextYao}
                        className="w-full mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? '计算卦象...' :
                            divinationResult ? '重新开始' :
                                clickCount === 6 ? '完成' :
                                    `摇第 ${clickCount + 1} 爻`}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default IChing;

