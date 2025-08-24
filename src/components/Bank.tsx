import userStore from "@/lib/userStore";
import HistoryBox from "./HistorBox";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/utils";

export default function Bank({ toolId }: { toolId: number }) {
    const points = userStore((state) => state.points);
    const setPoints = userStore((state) => state.setPoints);
    const free = userStore((state) => state.free);
    const setFree = userStore((state) => state.setFree);
    const [price, setPrice] = useState<number>(0)


    function getPrice() {
        axios.get(API_URL + "/common/get_tool?time=" + Date.now()).then(res => {
            if (res.data.code == 200) {
                for (const tool of res.data.data) {
                    if (tool.id == toolId) {
                        setPrice(tool.price)
                    }
                }
            }
        })
    }
    useEffect(() => { 
        getPrice()
    },[points])
    return (
        <>
            <div className="flex flex-row mt-4 justify-between">
                <div className="flex items-center space-x-2 ">
                    <Label>可用:</Label>
                    <Label className="mr-2">{points.recharge + points.reward}</Label>
                    {/* <Label>限免:</Label>
                    <Label className="mr-2">{free}</Label> */}
                    <Label >单价:</Label>
                    <Label className="mr-2">{price}</Label>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                    <HistoryBox toolId={toolId}></HistoryBox>
                </div>
            </div>

        </>
    )
}