"use client"
import CardBox from "@/components/CardBox";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { API_URL, GetCardResponse } from "@/lib/utils";
import userStore from "@/lib/userStore";
import axios from "axios";
import useAuthStore from "@/lib/authStore";
import { useToast } from "@/hooks/use-toast";
import { ImageScatterComponent } from "@/components/image-scatter";
import Bank from "@/components/Bank";
import { LoadingIcon } from "@/data/Icons";
import VirtualCharacterInfo from "@/components/VirtualCharacterInfo";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";


function SimpleTarot() {
    const { toast } = useToast()
    const [currentImage, setCurrentImage] = useState<string[]>([]);
    const [reverse, setReverse] = useState<boolean[]>([]);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [question, setQuestion] = useState<string>("")
    const [response, setResponse] = useState<string>("")
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [refreshHandle, setRefreshHandle] = useState(0)

    const router = useRouter();


    const setPoints = userStore((state) => state.setPoints);
    const setFree = userStore((state) => state.setFree);
    const clearToken = useAuthStore((state) => state.clearToken);

    const [isSelect, setIsSelect] = useState<boolean>(false)
    const [cardNum, SetCardNum] = useState<number>(0)

    const [answerData, setAnswerData] = useState<GetCardResponse>()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = `Bearer ${localStorage.getItem("authToken")}`
            axios.defaults.headers.common['Authorization'] = authToken
        }
    }, []);

    function getUserInfo() {

        try {
            axios.get(API_URL + "/user/get_base_information?time=" + Date.now()).then(
                res => {
                    if (res.data.code == 200) {
                        setPoints(res.data.data.balance)
                        setFree(res.data.data.surplusFreeTimes)
                        setIsLogin(true)
                    } else {
                        reset()
                    }
                }
            )
        } catch (e) {
            reset()
        }
    }

    function sendQuestion() {

        try {
            if (question == "") {
                toast({
                    title: "请输入问题"
                })
                setIsSending(false)
                return
            }

            SetCardNum(0)
            setIsSending(true)
            setIsSelect(false)
            setCurrentImage([])
            setReverse([])

            axios.post(API_URL + "/tool/tarot/common", {
                question: question
            }).then((res) => {
                if (res.data.code == 200) {
                    const data = res.data.data as GetCardResponse
                    SetCardNum(data.cardList.length)
                    setIsSending(false)
                    getUserInfo()
                    setAnswerData(data)
                } else {
                    setResponse(res.data.message)
                    getUserInfo()
                    setIsSending(false)
                }
            })
        } catch (e) {
            reset()
        }
    }

    function needSelect() {
        if (cardNum > 0) {
            return true;
        }
    }

    function reset() {

        axios.get(API_URL + "/user/logout", {})
        clearToken()
        setIsLogin(false)
        router.push("/profile")
    }


    useEffect(() => {
        getUserInfo()
    }, [isSending])


    useEffect(() => {
        SetCardNum(0)
        if (answerData == undefined) {
            return
        }
        setCurrentImage(answerData.cardList.map((card) => {
            return "/static/" + card.link
        }))
        setReverse(answerData.reverseList)
        setResponse(answerData.answer)
    }, [isSelect])

    return (
        <div className="h-screen bg-gradient-to-b from-red-400 to-yellow-600 w-full">
            <head>
                <title>灵钥通枢 | 普通塔罗牌解析</title>
            </head>
            <Card>
                <CardContent>
                    <div className={"flex justify-center flex-col"}>
                        {isSelect ?
                            <CardBox currentImage={currentImage} reverse={reverse}></CardBox>
                            : <CardBox currentImage={[]} reverse={[]}></CardBox>}
                        <Bank toolId={1}></Bank>

                        <div className={"flex justifyecenter flex-row mt-2"}>
                            <Input type="text" placeholder="您的问题" className={"mr-2 ml-2"} value={question} onChange={
                                (e) => {
                                    setQuestion(e.target.value)
                                }
                            } />
                            <Button disabled={isSending || !isLogin} variant="outline" className={"mr-2"} onClick={
                                () => {
                                    sendQuestion()
                                }
                            }>{!isSending ? "抽卡" : <LoadingIcon></LoadingIcon>}</Button>
                        </div>
                        {needSelect() ? <ImageScatterComponent
                            emit={setIsSelect}
                            imageSrc="/defaultCard.png"
                            clicksToRestore={cardNum}
                            pieceCount={30}
                        /> : <></>}
                        <div>
                            <VirtualCharacterInfo
                                name="月瑶"
                                avatarUrl="AiAvator/tarotCommon.png?height=128&width=128"
                                type={1}
                                data={[question, response]}
                                handle={setRefreshHandle}
                                showFlag={response != ""}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SimpleTarot