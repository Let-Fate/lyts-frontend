'use client'

import AssistantCard from "@/components/AssistantCard";
import { useRouter } from "next/navigation";
import React from "react";




export default function Home() {

  const [assistants, setAssistants] = React.useState([
    {
      alias: "bazi_solve", router: "bazi", name: "八字解析", avatar: "/AiAvator/bazi.jpg?height=100&width=100",
      description: "八字命盘解读以及大运流年批注\n具有超强的解析力让你窥探未来一角\n星级: ★★★★✪\n",
      price: 0
    }, {
      alias: "meihua_solve", router: "meihua", name: "梅花易数", avatar: "/AiAvator/meihua.jpg?height=100&width=100",
      description: "\n具有独特的时空局辅助和应期算法\n独特的算法而又不失魅力\n星级: ★★★★✪",
      price: 0
    }, {
      alias: "tarot_common", router: "tarot_common", name: "新手塔罗", avatar: "/AiAvator/tarotCommon.png?height=100&width=100",
      description: "每日签到即可使用的塔罗牌解析\n也许能力不出众约等于免费\n能力: ★★☆☆☆\n",
      price: 0
    },
    {
      alias: "tarot_select_pro", router: "tarot_select", name: "高级塔罗自选", avatar: "/AiAvator/tarotSelect.png?height=100&width=100",
      description: "可以自选塔罗牌以及牌阵\n具有更强的塔罗牌解析能力\n能力: ★★★✪☆\n",
      price: 0
    },
    // {
    //   alias: "xiaoliuren_solve", router: "xiaoliuren", name: "小六壬肖琉[测试]", avatar: "/AiAvator/xiaoliu.jpg?height=100&width=100",
    //   description: "小六壬之道，虽简却能洞察天机\n擅长小六壬解盘\n",
    //   price: 0
    // },
    // {
    //   alias: "liuyao_solve", router: "liuyao", name: "六爻  柳摇", avatar: "/AiAvator/liuyao.jpg?height=100&width=100",
    //   description: "神兆机于动，余从来不言散\n擅长六爻排盘\n",
    //   price: 0
    // },
  ])
  const router = useRouter()

  const handleSelectAssistant = (router_name: string) => {
    router.push(router_name)
  }

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto mb-6">
      <div className="flex-grow bg-gradient-to-b from-red-400 to-yellow-600">
        <main className="container mx-auto px-4 py-8 flex-grow">
          <h2 className="text-3xl font-bold text-center mb-8 text-yellow-100">蛇年大吉 ｜ 个人中心签到免费使用 | 加群领取礼包码</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {assistants.map((assistant) => (
              <AssistantCard
                key={assistant.router}
                assistant={assistant}
                onSelect={() => handleSelectAssistant(assistant.router)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

