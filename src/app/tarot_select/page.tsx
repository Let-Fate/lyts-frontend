"use client"
import Bank from "@/components/Bank";
import CardBox from "@/components/CardBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VirtualCharacterInfo from "@/components/VirtualCharacterInfo";
import { LoadingIcon } from "@/data/Icons";
import { allTags, allTagsCN, spreadCardNumList, spreadNameList, spreadNameCNList } from "@/data/Tarot";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/lib/authStore";
import userStore from "@/lib/userStore";
import { API_URL } from "@/lib/utils";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect, useState } from "react";

export default function SelectTarot() {
    const { toast } = useToast()

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [currentImage, setCurrentImage] = useState<string[]>([]);

    const [selectedTagsIndexList, setSelectedTagsIndexList] = useState<number[]>([]);
    const [reverseTags, setReverseTags] = useState<boolean[]>([]);

    const filteredTags = allTags.filter(tag => {
        return (tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (allTagsCN[allTags.indexOf(tag)].includes(searchTerm));
    });

    const setPoints = userStore((state) => state.setPoints);
    const setFree = userStore((state) => state.setFree);

    const clearToken = useAuthStore((state) => state.clearToken);


    const [isSending, setIsSending] = useState<boolean>(false);
    const [question, setQuestion] = useState<string>("")
    const [response, setResponse] = useState<string>("")
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [spreadName, setSpreadName] = useState<string>("foundation")
    const [refreshHandle, setRefreshHandle] = useState(0)


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = `Bearer ${localStorage.getItem("authToken")}`
            axios.defaults.headers.common['Authorization'] = authToken
        }
    }, []);


    const addTag = (tag: string) => {
        if (selectedTags.length >= spreadCardNumList[spreadNameList.indexOf(spreadName)]) {
            alert("已经选满了")
            return
        }
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
            setReverseTags([...reverseTags, false]);
        }
        generateIndexList()
    };

    const removeTag = (tag: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
        setReverseTags(reverseTags.filter((_t, index) => selectedTags[index] !== tag));
        generateIndexList()
    };


    const setReverse = (tag: string) => {
        const index = selectedTags.indexOf(tag);
        const newReverse = [...reverseTags];
        newReverse[index] = !newReverse[index];
        setReverseTags(newReverse);
    }

    function generateIndexList() {
        const indexList: number[] = [];
        for (let i = 0; i < selectedTags.length; i++) {
            if (reverseTags[i]) {
                indexList.push(-(allTags.indexOf(selectedTags[i]) + 1));
            } else {
                indexList.push(allTags.indexOf(selectedTags[i]) + 1);
            }
        }
        console.log(indexList)
        setCurrentImage(indexList.map(index => `/static/${allTags[Math.abs(index) - 1]}.jpg`));
        setSelectedTagsIndexList(indexList);
    }


    function getUserInfo() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("authToken")}`
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
        setIsSending(true)
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("authToken")}`
        try {
            if (question == "") {
                toast({
                    title: "请输入问题"
                })
                setIsSending(false)
                return
            }
            if (selectedTags.length < spreadCardNumList[spreadNameList.indexOf(spreadName)]) {
                toast({
                    title: "请选择足够的牌"
                })
                setIsSending(false)
                return
            }
            if (spreadName == "") {
                toast({
                    title: "请选择牌阵"
                })
                setIsSending(false)
                return
            }

            setIsSending(true)
            axios.post(API_URL + "/tool/tarot/select_pro", {
                "question": question,
                "spreadName": spreadName,
                "cardIndexList": selectedTagsIndexList
            }).then((res) => {
                if (res.data.code == 200) {
                    setResponse(res.data.data.answer)
                    setIsSending(false)
                    getUserInfo()
                } else {
                    toast({
                        title: res.data.message
                    })
                    getUserInfo()
                    setIsSending(false)
                }
            })
        } catch (e) {
            reset()
        }
    }

    function generate_card() {
        if (spreadName == "") {
            toast({
                title: "请选择牌阵"
            })
            setIsSending(false)
            return
        }
        const num = spreadCardNumList[spreadNameList.indexOf(spreadName)]
        const indexList: number[] = []
        while (indexList.length < num) {
            let temp = Math.floor(Math.random() * 78);
            if (Math.random() < 0.5) {
                temp = -temp
            }
            if (!indexList.includes(temp)) {
                indexList.push(temp)
            }
        }
        setCurrentImage(indexList.map(index => `/static/${allTags[Math.abs(index)]}.jpg`));
        setSelectedTags(indexList.map(index => allTags[Math.abs(index)]));
        setReverseTags(indexList.map(index => index < 0));
    }

    function reset() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("authToken")}`
        axios.get(API_URL + "/user/logout", {})
        clearToken()
        setIsLogin(false)
        navigate("/profile")
    }

    useEffect(() => {
        getUserInfo()
    }, [isSending])

    useEffect(() => {
        console.log(selectedTags)
        generateIndexList()
    }, [selectedTags, reverseTags])

    useEffect(() => {
        console.log(selectedTagsIndexList)
        console.log(currentImage)
    }, [currentImage, selectedTagsIndexList])

    return (
        <div className="">
            <head>
                <title>灵钥通枢 | 高阶塔罗牌解析</title>
            </head>
            <div className="flex flex-col">
                <div className="h-2/5">
                    <CardBox currentImage={currentImage} reverse={reverseTags}></CardBox>
                </div>
                <div className="flex space-x-4 p-4 h-1/5">
                    <div className="w-2/5">
                        <input
                            type="text"
                            placeholder="搜索牌名..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <ul className="border rounded p-2 max-h-60 overflow-y-auto">
                            {filteredTags.map((tag, index) => (
                                <li
                                    key={index}
                                    className="cursor-pointer p-2 hover:bg-blue-100 rounded"
                                    onClick={() => addTag(tag)}
                                >
                                    {allTagsCN[allTags.indexOf(tag)]}
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className={"mt-4"} onClick={generate_card}>随机生成</Button>
                    </div>

                    <div className="w-3/5">
                        <h3 className="mb-4">已选择的牌: {selectedTags.length} 张</h3>
                        <ul className="border rounded p-2 max-h-60 overflow-y-auto">
                            {selectedTags.map((tag, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center p-2 hover:bg-red-100 rounded"
                                >
                                    {allTagsCN[allTags.indexOf(tag)]} - {reverseTags[index] ? "逆位" : "正位"}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-4 text-red-500 hover:text-red-700"
                                    >
                                        删除
                                    </button>
                                    <button
                                        onClick={() => setReverse(tag)}
                                        className="ml-4 text-green-500 hover:text-green-700"
                                    >
                                        逆反
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <Bank toolId={14}></Bank>
                <div className={"flex justifyecenter flex-row mt-2"}>
                    <Input type="text" placeholder="您的问题" className={"mr-2 ml-2"} value={question} onChange={
                        (e) => {
                            setQuestion(e.target.value)
                        }
                    } />
                    <SearchInput setSpreadName={setSpreadName}></SearchInput>
                    <Button disabled={isSending || !isLogin} variant="outline" className={"mr-2"} onClick={
                        () => {
                            sendQuestion()
                        }
                    }>{!isSending ? "提问" : <LoadingIcon></LoadingIcon>}</Button>
                </div>
                <div>
                    <VirtualCharacterInfo
                        name="灵星"
                        avatarUrl="AiAvator/tarotSelect.png?height=128&width=128"
                        type={14}
                        data={[question, response]}
                        handle={setRefreshHandle}
                        showFlag={response != ""}
                    />
                </div>
            </div>
        </div>
    )
}

interface SearchInputProps {
    setSpreadName: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput: React.FC<SearchInputProps> = ({ setSpreadName }) => {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredData, setFilteredData] = useState<string[]>(spreadNameList);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const inputRef = useRef<HTMLDivElement>(null);

    // 处理输入框变化的函数
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // 过滤数据
        const filtered = spreadNameList.filter(item => {
            const index = spreadNameList.indexOf(item);
            return item.toLowerCase().includes(value.toLowerCase()) ||
                (index !== -1 && spreadNameCNList[index].includes(value));
        }
        );
        setFilteredData(filtered);
    };

    // 点击外部时关闭下拉菜单
    const handleClickOutside = (event: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
            setIsFocused(false);
        }
    };

    // 添加监听器，用于点击外部时关闭浮动窗口
    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    React.useEffect(() => {
        setSpreadName(searchTerm)
        console.log(searchTerm)
    }, [searchTerm])

    return (
        <div className="w-full max-w-md mx-auto relative mr-2" ref={inputRef}>
            {/* 输入框 */}
            <input
                type="text"
                value={spreadNameCNList[spreadNameList.indexOf(searchTerm)]}
                onChange={handleSearch}
                onFocus={() => setIsFocused(true)}
                placeholder="使用牌阵"
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            {/* 过滤后的结果，浮动显示 */}
            {isFocused && (
                <ul className="absolute left-0 right-0 border border-gray-300 rounded p-2 mt-1 bg-white max-h-60 overflow-y-auto z-10">
                    {filteredData.map((item, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                                setSearchTerm(item);
                                setIsFocused(false);
                            }}
                        >
                            {spreadNameCNList[spreadNameList.indexOf(item)]} - {spreadCardNumList[index]}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};