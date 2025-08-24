import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { API_URL } from '@/lib/utils'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface Assistant {
  alias: string
  router: string
  name: string
  avatar: string
  description: string
}

interface AssistantCardProps {
  assistant: Assistant
  onSelect: () => void
}

export default function AssistantCard({ assistant, onSelect }: AssistantCardProps) {
  const [price, setPrice] = useState<number>(0)

  function getPrice() {
    axios.get(API_URL + "/common/get_tool?time=" + Date.now()).then(res => {
      if (res.data.code == 200) {
        for (const tool of res.data.data) {
          if (assistant.alias == tool.alias) {
            setPrice(tool.price)
          }
        }
      }
    })
  }

  useEffect(() => {
    getPrice()
  }, [onselect])
  return (
    <Card className="flex flex-col h-full transition-transform hover:scale-105 bg-white/10 backdrop-blur-lg border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-center">{assistant.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-center mb-4">
          <img
            src={assistant.avatar}
            alt={assistant.name}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <p className="text-center text-sm text-white/80 whitespace-pre-line">{assistant.description}</p>
        <p className="text-center text-sm text-white/80 whitespace-pre-line">*原价：{price * 3.3} 虚拟币 ({price * 3.3 /10} 人民币)</p>
        <p className="text-center text-sm text-white/80 whitespace-pre-line">*现价：{price} 虚拟币 ({price/10} 人民币)</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onSelect} className="bg-white text-purple-600 hover:bg-white/90">选择</Button>
      </CardFooter>
    </Card>
  )
}

