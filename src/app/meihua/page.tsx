"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast';
import axios from "axios"
import { API_URL } from "@/lib/utils"
import Bank from "@/components/Bank"
import useAuthStore from "@/lib/authStore"
import userStore from "@/lib/userStore"
import VirtualCharacterInfo from "@/components/VirtualCharacterInfo"
import { useRouter } from "next/navigation"

type DivinationMethod = "number" | "random" | "time";

type ApiResponse = {
  code: number;
  message: string;
  data: HexagramData;
};

type HexagramData = {
  bazi: string[];
  ben: Hexagram;
  hu: Hexagram;
  bian: Hexagram;
  dong: number;
};

type Hexagram = {
  name: string;
  guaci: string;
  shanggua: string;
  xiagua: string;
  yao: string[];
};

const elementColors = {
  "金": "bg-yellow-300 text-yellow-900",
  "木": "bg-green-300 text-green-900",
  "水": "bg-blue-300 text-blue-900",
  "火": "bg-red-300 text-red-900",
  "土": "bg-orange-300 text-orange-900"
}

const elements: { [key: string]: string } = {
  "乾": "金", "兑": "金",
  "离": "火",
  "震": "木", "巽": "木",
  "坎": "水",
  "艮": "土", "坤": "土"
};
const baGuaInfo: Record<string, string> = {
  "乾": "天，健，刚健，自强不息；五行：金；方位：西北；季节：秋冬之交；代表事物：天、君、龙、马、头",
  "坤": "地，顺，柔顺，厚德载物；五行：土；方位：西南；季节：夏秋之交；代表事物：地、母、牛、布、腹",
  "震": "雷，动，震动，启发；五行：木；方位：正东；季节：春季；代表事物：雷、长男、竹、龙、脚",
  "巽": "风，入，渗透，和顺；五行：木；方位：东南；季节：春夏之交；代表事物：风、长女、树木、鸡、大腿",
  "坎": "水，陷，险难，智慧；五行：水；方位：正北；季节：冬季；代表事物：水、中男、沟渠、鱼、耳",
  "离": "火，附丽，明亮，文明；五行：火；方位：正南；季节：夏季；代表事物：火、中女、日、电、目",
  "艮": "山，止，静止，稳定；五行：土；方位：东北；季节：冬春之交；代表事物：山、少男、石、狗、手",
  "兑": "泽，说，悦，喜悦；五行：金；方位：正西；季节：秋季；代表事物：泽、少女、湖、羊、口"
};
function renderYao(yao: string, isMoving: boolean) {
  return (
    <div className={`text-center ${isMoving ? "text-red-500 font-bold" : ""}`}>
      {yao}
    </div>
  )
}

function HexagramPart({ hexagram, type, isMoving }: { hexagram: Hexagram, type: "上卦" | "下卦", isMoving: boolean[] }) {
  const gua = type === "上卦" ? hexagram.shanggua : hexagram.xiagua;
  const colorClass = elementColors[getElement(gua) as keyof typeof elementColors];
  const yaoStart = type === "上卦" ? 0 : 3;
  const yaoEnd = type === "上卦" ? 3 : 6;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`cursor-pointer hover:opacity-80 p-2 rounded transition-colors ${colorClass}`}>
          {hexagram.yao.slice(yaoStart, yaoEnd).map((yao, index) => (
            renderYao(yao, isMoving[yaoStart + index])
          ))}
          <div className="text-center mt-1">
            {type}{gua}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gua}</DialogTitle>
          <DialogDescription>
            {baGuaInfo[gua]}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {hexagram.yao.map((yao, index) => renderYao(yao, isMoving[index])).filter(
            (_, index) => index >= yaoStart && index < yaoEnd
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
function getElement(gua: keyof typeof elements) {
  return elements[gua] || "未知";
}

export default function MeiHua() {
  const [diviningMethod, setDiviningMethod] = useState<DivinationMethod>("random");
  const [inputNumber, setInputNumber] = useState("100");
  const [hexagramData, setHexagramData] = useState<HexagramData | null>(null);
  const setPoints = userStore((state) => state.setPoints);
  const setFree = userStore((state) => state.setFree);
  const [refreshHandle, setRefreshHandle] = useState(0)
  const { toast } = useToast()

  const clearToken = useAuthStore((state) => state.clearToken);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNumber(e.target.value)
  }


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = `Bearer ${localStorage.getItem("authToken")}`
      axios.defaults.headers.common['Authorization'] = authToken
    }
  }, []);


  const calculateHexagrams = async () => {
    let endpoint: string;
    if (diviningMethod === "number") {
      if (!(inputNumber.length >= 1)) {
        alert("请输入数字");
        return;
      }
    }
    axios.post(API_URL + "/tool/meihua/arrange?time=" + Date.now(), {
      type: diviningMethod,
      number: Number(inputNumber)
    }).then(res => {
      const data = res.data as ApiResponse;
      if (data.code === 200) {
        const hex = data.data;
        hex.ben.yao = hex.ben.yao.reverse();
        hex.hu.yao = hex.hu.yao.reverse();
        hex.bian.yao = hex.bian.yao.reverse();
        setHexagramData(hex)
      } else {
        toast({
          title: data.message
        })
      }
    })
  };




  const renderHexagram = (title: string, hexagram: Hexagram, isMoving: boolean[] = []) => {
    if (!hexagram) return null;
    return (
      <div className="flex flex-col items-center mr-2">
        <h3 className="text-lg font-semibold mb-2">{hexagram.name}</h3>
        <div className="border rounded p-2">
          <HexagramPart hexagram={hexagram} type="上卦" isMoving={isMoving} />
          <div className="border-t my-2"></div>
          <HexagramPart hexagram={hexagram} type="下卦" isMoving={isMoving} />
        </div>
      </div>
    )
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

  useEffect(() => {
    getUserInfo()
  }, [refreshHandle])

  const router = useRouter()
  function reset() {
    axios.get(API_URL + "/user/logout", {})
    clearToken()
    router.push("/profile")
  }

  return (
    <div className="h-screen bg-gradient-to-b from-amber-50 to-orange-200 w-full">
      <head>
        <title>灵钥通枢 | 梅花易数</title>
      </head>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <Select value={diviningMethod} onValueChange={(value: DivinationMethod) => setDiviningMethod(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择起卦方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="number">数字起卦</SelectItem>
                <SelectItem value="random">随机起卦</SelectItem>
                <SelectItem value="time">时间起卦</SelectItem>
              </SelectContent>
            </Select>
            {diviningMethod === "number" && (
              <Input
                type="number"
                placeholder="请输入三位数"
                value={inputNumber}
                onChange={handleInputChange}
              />
            )}
          </div>
          <Button className="w-full mb-4" onClick={calculateHexagrams}>
            摇一摇
          </Button>
          {hexagramData && (
            <>
              <div className="mb-4 text-center">
                <div className="grid grid-cols-4 gap-4">
                  {['年柱', '月柱', '日柱', '时柱'].map((pillar, index) => (
                    <div key={pillar} className="flex flex-col items-center">
                      <span className="font-medium">{pillar}</span>
                      <span>{hexagramData.bazi[index][0]}</span>
                      <span>{hexagramData.bazi[index][1]}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-row text-center mt-4 font-semibold ml-8">
                  {renderHexagram("本卦", hexagramData.ben, Array(6).fill(false).map((_, i) => i === hexagramData.dong - 1))}
                  {renderHexagram("互卦", hexagramData.hu)}
                  {renderHexagram("变卦", hexagramData.bian)}
                </div>
              </div>
            </>
          )}
          <Bank toolId={7}></Bank>
          <div>
            <VirtualCharacterInfo
              name="天凤"
              avatarUrl="AiAvator/meihua.jpg?height=128&width=128"
              type={7}
              data={hexagramData}
              handle={setRefreshHandle}
              showFlag={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}