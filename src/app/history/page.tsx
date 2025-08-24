import ClientShareButton from "@/components/ClientShareButton";
import HomeButton from "@/components/HomeButton";
import Share from "@/components/Share";
import { API_URL } from "@/lib/utils";
import axios from "axios";

type Data = {
    request: string;
    response: string;
    time: string;
    tool: {
        name: string;
        alias: string;
    };
};

async function fetchData(id: string): Promise<Data> {
    const res = await axios.get(`${API_URL}/common/get_record?id=${id}&time=${Date.now()}`);
    if (res.data.data == null) {
        return {
            request: "",
            response: "",
            time: "",
            tool: {
                name: "此记录不存在",
                alias: "",
            },
        }
    }
    return res.data.data as Data;
}

const HistoryPage = async ({ searchParams }: { searchParams: Promise<{ id: string }> }) => {
    const params = await searchParams;
    const data = await fetchData(params.id);

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
        <div className="min-h-screen bg-gradient-to-r from-red-400 to-yellow-700 flex flex-col items-center justify-start">
            <div className="w-full max-w-2xl mt-8 flex justify-between items-center">
                <HomeButton />
                <h1 className="text-white text-2xl font-semibold">来自：{data.tool.name}</h1>
                <ClientShareButton data={data} />
            </div>
            <div className="w-full max-w-2xl mt-4">
                <Share request={data.request} response={data.response} time={formatTimestamp(data.time)} alias={data.tool.alias} />
            </div>
        </div>
    );
};


export default HistoryPage;

