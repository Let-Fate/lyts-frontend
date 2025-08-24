import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import ChatInterface from './chat-interface'
import { useToast } from '@/hooks/use-toast'
import { API_URL } from '@/lib/utils'
import axios from 'axios'

interface VirtualCharacterInfoProps {
  name: string
  avatarUrl: string;
  type: number;
  data: unknown;
  handle: React.Dispatch<React.SetStateAction<number>>
  showFlag: boolean;
}

export default function VirtualCharacterInfo(props: VirtualCharacterInfoProps) {
  const [showChat, setShowChat] = useState(false)
  const { toast } = useToast()

  const view = () => {
    const toolId = props.type
    // const toolId = window.location.href.replace(window.location.origin,"").replace("/","")
    axios.get(API_URL + "/user/get_record?time=" + Date.now(), {
      params: {
        "pageSize": 30,
        "toolId": toolId,
        "pageNumber": 1
      }
    }).then(
      res => {
        if (res.data.code == 200) {
          console.log(res.data.data.data[0])
          const id = res.data.data.data[0].id
          window.location.href = `${window.location.origin}/history?id=${id}`
        }
      }
    )
  }


  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 mt-4 flex-col">
      {
        !(showChat || props.showFlag) && (
          <Button
            disabled={props.data == null || (props.data as string[])[1] === ""}
            className="w-full sm:w-auto"
            onClick={() => {
              if (props.data != null && (props.data as string[])[1] !== "") {
                setShowChat(true)
              } else {
                toast({
                  title: "你要自己摇卦或者抽卡哦！"
                })
              }
            }}
          >
            点击获取答案 若为灰色请耐心等待
          </Button>
        )
      }
      {(showChat || props.showFlag) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">{props.name}</h2>
              <Button variant="ghost" onClick={() => view()}>
                详情
              </Button>
              <Button variant="ghost" onClick={() => location.reload()}>
                刷新
              </Button>
            </div>
            <ChatInterface {...props} />
          </div>
        </div>
      )}
    </div>
  )
}

