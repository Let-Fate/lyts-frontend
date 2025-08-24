"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { DateData, DatePicker } from '@/components/DatePicker'
import { IconRight } from 'react-day-picker'
import axios from 'axios'
import { API_URL } from '@/lib/utils'
import userStore from '@/lib/userStore'
import useAuthStore from '@/lib/authStore'
import { FateData, FateSelectorDialog, YearData } from '@/components/fate-selector-dialog';
import { useToast } from '@/hooks/use-toast';
import useBaziStore from '@/lib/BaziStore';
import Bank from '@/components/Bank';
import VirtualCharacterInfo from '@/components/VirtualCharacterInfo';
import { useRouter } from 'next/navigation'
import { TimerIcon, LoaderIcon } from 'lucide-react'

const elementColors = {
    木: 'text-green-600',
    火: 'text-red-600',
    土: 'text-yellow-600',
    金: 'text-gray-600',
    水: 'text-blue-600'
} as const

const elementMap = {
    甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土',
    庚: '金', 辛: '金', 壬: '水', 癸: '水',
    子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
    午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水'
} as const

type ElementType = keyof typeof elementColors;

interface Data {
    yearPillar: BaziPillar;
    monthPillar: BaziPillar;
    dayPillar: BaziPillar;
    hourPillar: BaziPillar;
    baZiWuXingCount: string[];
    baZiwuXingWangShuai: string[];
    bodyIntensity: string;
    guZhong: string;
    guZhongPiZhu: string;
    dayZhuLunMing: string;
    yinYuan: string;
    wuXingFenXi: string;
    dayun: Array<Array<string>>;
    liuNian: Array<Array<string>>;

}
interface YunItem {
    year: number;
    gan: string;
}

const ColoredText = ({ text }: { text: string }) => {
    const element = elementMap[text as keyof typeof elementMap] as ElementType
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <span className={elementColors[element]}>{text}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{element}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

type BaziPillar = {
    name: string;
    heavenlyStems: string;
    earthlyBranches: string;
    hidden: string[];
    deities: string;
    fuxing: string[];
}

type BaziData = BaziPillar[];

export default function Bazi() {
    const [refreshHandle, setRefreshHandle] = useState(0)
    const { toast } = useToast()
    const [answer, setAnswer] = useState('');

    const [baziData, setBaziData] = useState<BaziData>([]);
    const [baziAll, setBaziAll] = useState<Data>();

    const [isSending, setIsSending] = useState<boolean>(false);
    const setPoints = userStore((state) => state.setPoints);
    const setFree = userStore((state) => state.setFree);

    const clearToken = useAuthStore((state) => state.clearToken);

    const [selectedFate, setSelectedFate] = useState<string>("")
    const [selectedYear, setSelectedYear] = useState<string>("")
    const [selectedYearNumber, setSelectedYearNumber] = useState<number | null>(null)



    const date = useBaziStore((state) => state.data);
    const setData = useBaziStore((state) => state.setData);
    const [baziDate, SetBaziDate] = useState<DateData>(date)

    const [gender, setGender] = React.useState<string>('男')
    const [dayun, setDayun] = React.useState<Record<string, FateData>>({})




    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = `Bearer ${localStorage.getItem("authToken")}`
            axios.defaults.headers.common['Authorization'] = authToken
        }
    }, []);

    const handleSelect = (fate: string, year: string, yearNumber: number) => {
        setSelectedFate(fate)
        setSelectedYear(year)
        setSelectedYearNumber(yearNumber)
        console.log(fate, year, yearNumber)
    }


    function reset() {
        axios.get(API_URL + "/user/logout", {})
        clearToken()
        router.push("/profile")
    }


    function generateTimeStr() {
        return `${date.year}年${date.month}月${date.day}日${date.hour}时${date.minute}分  ${gender}`
    }

    function solveBazi() {
        console.log(getBazi(), selectedFate, selectedYear)
        if (getBazi() == "") {
            toast({
                title: "请先排盘"
            })
            return
        }
        if (!isSending) {
            setIsSending(true)
            axios.post(API_URL + '/tool/bazi/solve?time=' + Date.now(), {
                bazi: getBazi(),
                dayun: selectedFate,
                liunian: selectedYear,
                gender: gender
            }).then(
                res => {
                    if (res.data.code == 200) {
                        setAnswer("")
                        setAnswer(res.data.data)
                    } else {
                        toast({
                            title: res.data.message
                        })
                    }
                    setIsSending(false)
                }
            ).catch(
                error => {
                    setIsSending(false)
                    toast({
                        title: "网络连接失败"
                    })
                }
            )
        }
    }

    function arrangeBazi() {
        axios.post(API_URL + '/tool/bazi/arrange?time=' + Date.now(), {
            year: date.year,
            month: date.month,
            day: date.day,
            hour: date.hour,
            minute: date.minute,
            gender: gender
        })
            .then((response) => {
                if (response.data.code != 200) {
                    toast({
                        title: response.data.message
                    })
                    return;
                }

                setSelectedFate("")
                setSelectedYear("")
                const data = response.data.data as Data
                setBaziAll(data)
                const yearPillar: BaziPillar = {
                    name: '年柱',
                    heavenlyStems: data.yearPillar.heavenlyStems,
                    earthlyBranches: data.yearPillar.earthlyBranches,
                    hidden: data.yearPillar.hidden,
                    deities: data.yearPillar.deities,
                    fuxing: data.yearPillar.fuxing
                }
                const monthPillar: BaziPillar = {
                    name: '月柱',
                    heavenlyStems: data.monthPillar.heavenlyStems,
                    earthlyBranches: data.monthPillar.earthlyBranches,
                    hidden: data.monthPillar.hidden,
                    deities: data.monthPillar.deities,
                    fuxing: data.monthPillar.fuxing
                }
                const dayPillar: BaziPillar = {
                    name: '日柱',
                    heavenlyStems: data.dayPillar.heavenlyStems,
                    earthlyBranches: data.dayPillar.earthlyBranches,
                    hidden: data.dayPillar.hidden,
                    deities: data.dayPillar.deities,
                    fuxing: data.dayPillar.fuxing
                }
                const hourPillar: BaziPillar = {
                    name: '时柱',
                    heavenlyStems: data.hourPillar.heavenlyStems,
                    earthlyBranches: data.hourPillar.earthlyBranches,
                    hidden: data.hourPillar.hidden,
                    deities: data.hourPillar.deities,
                    fuxing: data.hourPillar.fuxing
                }
                setBaziData([yearPillar, monthPillar, dayPillar, hourPillar])
                const dayun = (data.dayun.map((item) => {
                    return {
                        year: Number(item[0]),
                        gan: item[2]
                    }
                }).filter((item): item is YunItem => item !== undefined))

                const liunian = data.liuNian.map((item) => {
                    return {
                        year: Number(item[0]),
                        gan: item[2]
                    }
                }).filter((item): item is YunItem => item !== undefined)

                /**
                 * 生成大运流年数据
                 */
                const temp: Record<string, FateData> = {}
                for (const i in dayun) {
                    const yun = dayun[i]
                    const liunianList: YearData[] = []
                    for (const j in liunian) {
                        let index = 0;
                        const nian = liunian[j]
                        if (dayun[Number(i) + 1] == undefined) {
                            break;
                        }
                        if (nian.year >= dayun[Number(i) + 1].year) {
                            break;
                        }
                        if (nian.year >= yun.year) {
                            const item: YearData = {
                                name: nian.gan,
                                year: nian.year
                            }
                            liunianList.push(item)
                            index++;
                        }
                    }
                    if (liunian != undefined && yun.gan != undefined && liunianList.length > 0) {
                        temp[yun.gan] = {
                            years: liunianList
                        }
                    }
                }
                setDayun(temp as Record<string, FateData>)
            })
            .catch((error) => {
                toast({
                    title: "网络连接失败"
                })
                console.log(error)
            })
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


    function getBazi() {
        if (baziData.length == 0) {
            return ""
        } else {
            return baziData[0].heavenlyStems + baziData[0].earthlyBranches + "  "
                + baziData[1].heavenlyStems + baziData[1].earthlyBranches + "  "
                + baziData[2].heavenlyStems + baziData[2].earthlyBranches + "  "
                + baziData[3].heavenlyStems + baziData[3].earthlyBranches
        }
    }
    useEffect(() => {
        getUserInfo()
    }, [baziData])


    useEffect(() => {
        getUserInfo()
    }, [isSending])

    useEffect(() => {
        console.log(selectedFate, selectedYear)
    }, [selectedFate])

    useEffect(() => {
        setData(baziDate)
        setSelectedFate("")
        setSelectedYear("")
    }, [baziDate])

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center"></TableHead>
                                {baziData.map((pillar) => (
                                    <TableHead key={pillar.name} className="text-center">{pillar.name}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">主星</TableCell>
                                {baziData.map((pillar) => (
                                    <TableCell key={pillar.name} className="text-center">{pillar.deities}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">天干</TableCell>
                                {baziData.map((pillar) => (
                                    <TableCell key={pillar.name} className="text-center">
                                        <ColoredText text={pillar.heavenlyStems} />
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">地支</TableCell>
                                {baziData.map((pillar) => (
                                    <TableCell key={pillar.name} className="text-center">
                                        <ColoredText text={pillar.earthlyBranches} />
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">藏干</TableCell>
                                {baziData.map((pillar) => (
                                    <TableCell key={pillar.name} className="text-center">
                                        <div className="flex flex-col items-center">
                                            {pillar.hidden.map((char, index) => (
                                                <ColoredText key={index} text={char} />
                                            ))}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">副星</TableCell>
                                {baziData.map((pillar) => (
                                    <TableCell key={pillar.name} className="text-center">
                                        <div className="flex flex-col items-center">
                                            {pillar.fuxing.map((char, index) => (
                                                <ColoredText key={index} text={char} />
                                            ))}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className='flex justify-between'>
                    <div className='mr-4'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <TimerIcon className="h-4 w-4" />
                                    {generateTimeStr()}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <DatePicker emit={SetBaziDate} gender={setGender} date={date} />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="mr-4" hidden={Object.keys(dayun).length == 0}>
                        <FateSelectorDialog dayun={dayun} onSelect={handleSelect} />
                        {selectedFate && selectedYear && selectedYearNumber && (
                            <div className="mt-4 bg-secondary/10 rounded-md text-sm">
                            </div>
                        )}
                    </div>
                </div>
                <Bank toolId={4}></Bank>
                <div className="mt-4 flex justify-between">
                    <Button variant="default" className="flex items-center gap-2" onClick={arrangeBazi}>
                        <IconRight className="h-4 w-4" />
                        开始排盘
                    </Button>
                    <Button disabled={isSending} variant="default" className={"mr-2"} onClick={
                        () => {
                            solveBazi()
                        }
                    }>{!isSending ? "开始解盘" : <LoaderIcon></LoaderIcon>}</Button>
                </div>
            </CardContent>
            <div>
                <VirtualCharacterInfo
                    name="溯明"
                    avatarUrl="AiAvator/bazi.jpg?height=128&width=128"
                    type={4}
                    data={["开始分析", answer]}
                    handle={setRefreshHandle}
                    showFlag={answer != ""}
                />
            </div>
        </Card>
    )
}