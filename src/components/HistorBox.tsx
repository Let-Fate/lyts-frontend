import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import axios from "axios";
import { API_URL } from "@/lib/utils";
import useAuthStore from "@/lib/authStore";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";


export interface QA {
    name: string;
    request: string;
    response: string;
    time: number
    id: string
}

export default function HistoryBox({ toolId }: { toolId: number }) {
    const clearToken = useAuthStore((state) => state.clearToken);

    const router = useRouter();

    const [historyData, setHistoryData] = useState<QA[]>([]);
    function getQARecord() {

        try {
            axios.get(API_URL + "/user/get_record?time=" + Date.now(), {
                params: {
                    "pageSize": 30,
                    "toolId": toolId,
                    "pageNumber": 1
                }
            }).then(
                res => {
                    if (res.data.code == 200) {
                        setHistoryData(res.data.data.data as QA[])
                        console.log(historyData)
                    } else {
                        reset()
                    }
                }
            )
        } catch (e) {
            reset()
        }
    }


    function reset() {

        axios.get(API_URL + "/user/logout", {})
        clearToken()
        router.push("/profile")
    }


    return (
        <>
            <Dialog>
                <DialogTrigger>
                    <Button variant="secondary" onClick={getQARecord}><HistoryIcon></HistoryIcon>历史记录</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>历史记录</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="h-[480px]  rounded-md border p-4">
                        <div className="flex items-center space-x-2">
                            <Accordion type="single" collapsible className="w-full">
                                {historyData.map((item, index) => (
                                    <HistorItem key={index} index={item.id.toString()} {...item}></HistorItem>
                                ))}
                            </Accordion>
                        </div>
                    </ScrollArea>

                </DialogContent>
            </Dialog>
        </>
    )
}
interface HistorItemProps {
    index: string;
    name: string;
    request: string;
    response: string;
    id: string,
    time: number
}
function HistorItem(props: HistorItemProps) {
    const formatTimestamp = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            // second: 'numeric',
        });
    };
    return (
        <>
            <AccordionItem value={props.index} onClick={() => {
                        window.location.href = window.location.origin+"/history?id=" + props.id
                    }}>
                <AccordionTrigger>
                    <div className="flex justify-between w-full">
                        <span>{props.request}</span>
                        <span>{formatTimestamp(props.time)}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent style={{ whiteSpace: 'pre-wrap' }}>
                    {props.response}
                </AccordionContent>
            </AccordionItem>
        </>
    )
}
function HistoryIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor"
                d="M12 21q-3.45 0-6.012-2.287T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.037T19 12t-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12t-.712 3.513t-1.925 2.85t-2.85 1.925T12 21m2.8-4.8L11 12.4V7h2v4.6l3.2 3.2z" />
        </svg>
    )
}