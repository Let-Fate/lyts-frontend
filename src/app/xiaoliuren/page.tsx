"use client"
import Bank from "@/components/Bank";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import VirtualCharacterInfo from "@/components/VirtualCharacterInfo";
import useAuthStore from "@/lib/authStore";
import userStore from "@/lib/userStore";
import { API_URL } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Xiaoliu = () => {

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = `Bearer ${localStorage.getItem("authToken")}`
            axios.defaults.headers.common['Authorization'] = authToken
        }
    }, []);

    const [refreshHandle, setRefreshHandle] = useState(0)
    const liuShen = ['大安', '留连', '速喜', '赤口', '小吉', '空亡'];
    const calculateDivination = (num1: number, num2: number, num3: number) => {
        const index1 = num1 % 6;
        const index2 = (num1 + num2 - 1) % 6;
        const index3 = (num1 + num2 + num3 - 2) % 6;
        const divination1 = liuShen.at(index1 - 1);
        const divination2 = liuShen.at(index2 - 1);
        const divination3 = liuShen.at(index3 - 1);
        return {
            divination1,
            divination2,
            divination3
        };
    };

    const generateDivinationText = (divination1: string, divination2: string, divination3: string) => {

        const texts: { [key: string]: string } = {
            '大安': '万事大吉，身心安泰，所求皆如意。',
            '留连': '事多阻滞，凡事宜缓不宜急。',
            '速喜': '喜事临门，吉祥如意，吉庆可期。',
            '赤口': '口舌是非，谨慎言行，避免争执。',
            '小吉': '平安顺遂，虽无大利，亦无大害。',
            '空亡': '事难成就，凡事宜守不宜进。'
        };
        const explain1: string = texts[divination1 as keyof typeof texts];
        const explain2: string = texts[divination2 as keyof typeof texts];
        const explain3: string = texts[divination3 as keyof typeof texts];

        return {
            explain1,
            explain2,
            explain3
        }
    };

    const [nums, setNums] = useState({ num1: 0, num2: 0, num3: 0 })
    const [diValue, setDiValue] = useState<string[]>([])
    const [diKey, setDiKey] = useState<string[]>([])
    const [aiResponse, setAiResponse] = useState('');
    const [isManual, setIsManual] = useState(false);


    const setPoints = userStore((state) => state.setPoints);
    const setFree = userStore((state) => state.setFree);


    const setNumsByTime = () => {
        const now = new Date();
        // 获取北京时间
        const beijingTime = new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60000);
        const hour = beijingTime.getHours();
        const minute = beijingTime.getMinutes();
        const minuteTens = Math.floor(minute / 10);
        const minuteOnes = minute % 10;
        setNums({
            num1: hour,
            num2: minuteTens,
            num3: minuteOnes
        });
    }

    function getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }



    function getUserInfo() {
        try {
            axios.get(API_URL + "/user/get_base_information?time=" + Date.now()).then(
                res => {
                    if (res.data.code == 200) {
                        setPoints(res.data.data.balance)
                        setFree(res.data.data.surplusFreeTimes)
                    } else {
                        reset()
                    }
                }
            )
        } catch (e) {
            reset()
        }
    }
    const clearToken = useAuthStore((state) => state.clearToken);
    const router = useRouter()
    function reset() {
        axios.get(API_URL + "/user/logout", {})
        clearToken()
        router.push("/profile")
    }

    useEffect(() => {
        getUserInfo()
    }, [refreshHandle])


    useEffect(() => {
        setNumsByTime()
    }, [aiResponse])

    useEffect(() => {
        console.log(diKey)
        console.log(diValue)
    }, [diValue, diKey])


    return (
        <>
            <div className="h-screen bg-gradient-to-b from-amber-50 to-orange-200 w-full">
                <Card className="w-full max-w-4xl mx-auto">
                    <CardContent>
                        <h1 className="ml-4 font-bold text-lg">请输入三个数字</h1>
                        <div className="flex flex-row ml-4 mr-4 mt-4">
                            <Input className="mr-2" value={nums.num1}
                                onChange={(e) => {
                                    setNums({
                                        ...nums,
                                        num1: Number(e.target.value)
                                    })
                                }}
                            ></Input>
                            <Input className="mr-2" value={nums.num2}
                                onChange={(e) => {
                                    setNums({
                                        ...nums,
                                        num2: Number(e.target.value)
                                    })
                                }}></Input>
                            <Input value={nums.num3}
                                onChange={(e) => {
                                    setNums({
                                        ...nums,
                                        num3: Number(e.target.value)
                                    })
                                }}></Input>
                        </div>
                        <div className="ml-4 mt-4" hidden={!isManual}>
                            {diKey.length == 3 && (
                                diKey.map((key, index) => {
                                    return <div key={key} className="flex flex-row">
                                        <h1 className="font-bold text-lg text-blue-600 mr-2 flex items-center">{key}:</h1>
                                        <p className="font-mono flex items-center">{diValue[index]}</p>
                                    </div>
                                })
                            )}
                        </div>
                        <div hidden={isManual}>
                            <Button className="ml-4 mt-4" onClick={() => {
                                const shen = calculateDivination(nums.num1, nums.num2, nums.num3);
                                if (shen.divination1 && shen.divination2 && shen.divination3) {
                                    const data = generateDivinationText(
                                        shen.divination1,
                                        shen.divination2,
                                        shen.divination3
                                    )
                                    setDiKey([shen.divination1, shen.divination2, shen.divination3])
                                    setIsManual(true);
                                    setDiValue([data.explain1, data.explain2, data.explain3])
                                }
                            }
                            }>
                                起局
                            </Button>
                            <Button className="ml-4 mt-4"
                                onClick={() => {
                                    setNums({
                                        num1: getRandomNumber(1, 99),
                                        num2: getRandomNumber(1, 99),
                                        num3: getRandomNumber(1, 99)
                                    })
                                }}
                            >随机生成</Button>

                        </div>
                        <Bank toolId={10}></Bank>
                        <div>
                            <VirtualCharacterInfo
                                name="肖琉"
                                avatarUrl="AiAvator/xiaoliu.jpg?height=128&width=128"
                                type={10}
                                data={!isManual ? null : {
                                    isManual: isManual,
                                    divination: diKey,
                                    explain: diValue,
                                }}
                                handle={setRefreshHandle}
                                showFlag={false}
                            />
                        </div>
                    </CardContent>
                </Card>

            </div >
        </>
    )
}
export default Xiaoliu;