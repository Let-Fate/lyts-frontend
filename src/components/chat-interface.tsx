import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { title } from 'process'
import { API_URL } from '@/lib/utils'
import axios from 'axios'
import { LoadingIcon } from '@/data/Icons'
import { QA } from './HistorBox'
import { useFetcher } from 'react-router-dom'

interface Message {
  content: string
  isUser: boolean
}

interface TypingState {
  isTyping: boolean
  currentText: string
  fullText: string
}


interface VirtualCharacterInfoProps {
  name: string
  avatarUrl: string;
  type: number;
  data: unknown;
  handle: React.Dispatch<React.SetStateAction<number>>
}

export default function ChatInterface(props: VirtualCharacterInfoProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isSending, setIsSending] = useState<boolean>(false);
  const [input, setInput] = useState('')
  const { toast } = useToast()
  const [typingState, setTypingState] = useState<TypingState>({
    isTyping: false,
    currentText: '',
    fullText: ''
  })

  function generateChat(reponse: string) {
    if (input != "") {
      setMessages(prev => [...prev, { content: input, isUser: true }])
    }
    setTypingState({
      isTyping: true,
      currentText: '',
      fullText: reponse
    })
    props.handle(Date.now())
    setInput("")
  }

  function meihua() {
    if (input == "") {
      toast({
        title: "请输入问题",
      })
      return
    }

    setIsSending(true)
    try {
      axios.post(API_URL + "/tool/meihua/solve?time=" + Date.now(), {
        question: input,
        arrangeResponse: props.data
      }).then((res) => {
        if (res.data.code == 200) {
          generateChat(res.data.data)
        } else {
          toast({
            title: res.data.message
          })
        }
        setIsSending(false)
      })
    } catch (e) {
      toast({
        title: "网络错误"
      })
      setIsSending(false)
    }
  }

  interface xiaoliuData {
    isMaual: boolean,
    divination: string[]
    explain: string[]
  }
  function xiaoliu() {
    if (input == "") {
      toast({
        title: "请输入问题",
      })
      return
    }

    setIsSending(true)
    try {
      axios.post(API_URL + "/tool/xiaoliuren/solve?time=" + Date.now(), {
        question: input,
        liushen: (props.data as xiaoliuData).divination,
      }).then((res) => {
        if (res.data.code == 200) {
          generateChat(res.data.data)
        } else {
          toast({
            title: res.data.message
          })
        }
        setIsSending(false)
      })
    } catch (e) {
      toast({
        title: "网络错误"
      })
      setIsSending(false)
    }
  }

  function tarot_common() {
    const data = props.data as string[]
    generateChat(data[1])
    setIsSending(false)
  }

  useEffect(() => {
    if (messages.length == 0) {
      console.log(props.type)
      console.log(props.data)
      let msg = ""
      switch (props.type) {
        case 7:
          msg = "你好，我是" + props.name + "\n接下来请输入你的问题\n我会告诉你我的理解\n回答时间较长 请耐心等待"
          setMessages([{
            content: msg,
            isUser: false
          }])
          break;
        case 10:
          msg = "你好，我是" + props.name + "\n接下来请输入你的问题\n我会告诉你我的理解\n一个卦只能对应一个问题哦"
          setMessages([{
            content: msg,
            isUser: false
          }])
          break;
        case 1:
          msg = "我是" + props.name + "\n我已经知晓你的情况\n接下来为你解析"
          setMessages([{
            content: (props.data as string[])[0],
            isUser: true
          }])
          tarot_common()
          setMessages(prev => [...prev, {
            content: msg,
            isUser: false
          }])
          break;
        case 4:
          msg = "我是" + props.name + "\n我已经知晓你的情况\n接下来为你解析"
          setMessages([{
            content: (props.data as string[])[0],
            isUser: true
          }])
          tarot_common()
          setMessages(prev => [...prev, {
            content: msg,
            isUser: false
          }])
          break;
        case 14:
          msg = "我是" + props.name + "\n我已经知晓你的情况\n接下来为你解析"
          setMessages([{
            content: (props.data as string[])[0],
            isUser: true
          }])
          tarot_common()
          setMessages(prev => [...prev, {
            content: msg,
            isUser: false
          }])
          break;
      }
    }

    if (typingState.isTyping) {
      if (typingState.currentText.length < typingState.fullText.length) {
        const timer = setTimeout(() => {
          setTypingState(prev => ({
            ...prev,
            currentText: prev.fullText.slice(0, prev.currentText.length + 1)
          }))
        }, 10)
        return () => clearTimeout(timer)
      } else {
        setTypingState(prev => ({ ...prev, isTyping: false }))
        setMessages(prev => [...prev, { content: typingState.fullText, isUser: false }])
      }
    }
  }, [typingState])


  useEffect(() => {
    if (messages.length == 3) {
      // setMessages(prev => [...prev, { content: "问题回答结束，下一个问题请重新生成数据！", isUser: false }])
      setTypingState({
        isTyping: true,
        currentText: '',
        fullText: "下一轮将是新的对话 \n 如需继续请刷新页面"
      })
    }
  }, [messages])

  const handleSend = () => {
    switch (props.type) {
      case 7:
        meihua()
        break
      case 10:
        xiaoliu()
        break;
      default:
        break
    }
  }


  return (
    <div className="flex flex-col h-[80vh] bg-background shadow-xl rounded-b-2xl w-full overflow-hidden">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble avator={props.avatarUrl} key={index} message={message} />
        ))}
        {typingState.isTyping && (
          <MessageBubble avator={props.avatarUrl} message={{ content: typingState.currentText, isUser: false }} />
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isSending ||
            props.type == 1
          }>{!isSending ? "发送" : <LoadingIcon></LoadingIcon>}</Button>
        </div>
      </div>
    </div>
  )
}

interface MessageBubbleProps {
  message: Message;
  avator: string;
}

function MessageBubble({ message, avator }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      {!message.isUser && (
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src={avator} alt="Virtual Character" />
          <AvatarFallback>VC</AvatarFallback>
        </Avatar>
      )}
      <div className={`rounded-lg p-2 max-w-[70%] whitespace-pre-wrap ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
        }`}>
        {message.content.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < message.content.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
      {message.isUser && (
        <Avatar className="w-8 h-8 ml-2">
          <AvatarImage src="/AiAvator/user.jpg?height=32&width=32" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

