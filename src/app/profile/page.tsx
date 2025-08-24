"use client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import userStore from "@/lib/userStore";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/utils";
import useAuthStore from "@/lib/authStore";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TimeIcon, CoinIcon, PhoneIcon, VIPIcon, CheckIcon } from "@/data/Icons"
import { useRouter } from "next/navigation"

type Status = {
    value: string
    label: string
}
interface VipInfo {
    name: string;
    checkInPoint: number;
    id: number;
    price: number;
}

const statuses: Status[] = [
    {
        value: "2",
        label: "白银",
    },
    {
        value: "3",
        label: "黄金",
    },
    {
        value: "4",
        label: "铂金",
    },
    {
        value: "5",
        label: "钻石",
    },
]

interface Recharge {
    actualMoney: number;
    creationTime: number;
    name: string;
    id: string;
    point: number;
    money: number;
    paymentTime: string | null;
    state: boolean;
    url: string;
}

const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
};

export default function Profile() {
    const { toast } = useToast()
    const phone = userStore((state) => state.phone);
    const setPhone = userStore((state) => state.setPhone);
    const points = userStore((state) => state.points);
    const setPoints = userStore((state) => state.setPoints);
    const level = userStore((state) => state.level);
    const setLevel = userStore((state) => state.setLevel);
    const expire = userStore((state) => state.expire);
    const setExpire = userStore((state) => state.setExpire);
    const isLogin = userStore((state) => state.isLogin);
    const setIsLogin = userStore((state) => state.setIsLogin);
    const [isCheckIn, setIsCheckIn] = React.useState<boolean>(false)
    const setFree = userStore((state) => state.setFree);


    const setToken = useAuthStore((state) => state.setToken);
    const clearToken = useAuthStore((state) => state.clearToken);

    const [verifyUrl, setVerifyUrl] = React.useState<string>("");
    const [verifyKey, setVerifyKey] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [verifyCode, setVerifyCode] = React.useState<string>("");

    const [tabValue, setTabValue] = React.useState<string>("login");

    const [payCount, setPayCount] = React.useState<string>("");
    const [cardCode, setCardCode] = React.useState<string>("");

    const [rechargeList, setRechargeList] = React.useState<Recharge[]>([]);

    const [open, setOpen] = React.useState(false)
    const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
        null
    )
    const [newPassword, SetNewPassword] = React.useState<string>("")
    const [checkNumber, setCheckNumber] = useState<number>(20)


    const [isRecharging, setIsRecharging] = React.useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = `Bearer ${localStorage.getItem("authToken")}`
            axios.defaults.headers.common['Authorization'] = authToken
            if (localStorage.getItem("authToken") != "" && localStorage.getItem("authToken") != null) {
                setIsLogin(true)
                setTabValue("profile")
            }
        }
    }, []);

    function getRecharge() {

        try {
            axios.get(API_URL + "/user/get_recharge", {
                params: {
                    "pageSize": 10,
                    "pageNumber": 1
                }
            }).then(
                res => {
                    if (res.data.code == 200) {
                        setRechargeList(res.data.data.data as Recharge[])
                    }
                }
            )
        } catch (e) {
            logout()
        }
    }



    function openVIP() {
        axios.post(API_URL + "/user/open_vip", {
            "id": selectedStatus?.value
        }).then(res => {
            if (res.data.code == 200) {
                toast({
                    title: "开通成功"
                })
                getUserInfo()
            } else {
                toast({
                    title: res.data.message
                })
            }
        })

    }

    function getUserInfo() {
        axios.get(API_URL + "/user/get_base_information?time=" + Date.now()).then(
            res => {
                if (res.data.code == 200) {
                    setPhone(res.data.data.phoneNumber)
                    setPoints(res.data.data.balance)
                    setLevel(res.data.data.group.name)
                    setFree(res.data.data.surplusFreeTimes)
                    setCheckNumber(res.data.data.group.checkInPoint)
                    if (res.data.data.group.expirationTime == null) {
                        setExpire("永久")
                    } else {
                        setExpire(formatTimestamp(res.data.data.group.expirationTime))
                    }
                    if (res.data.data.checkIn) {
                        setIsCheckIn(true)
                    } else {
                        setIsCheckIn(false)
                    }
                } else {
                    logout()
                }
            }
        )
    }
    function isValidString(input: string): boolean {
        const regex = /^[a-zA-Z0-9]{5,15}$/;
        return regex.test(input);
    }

    function isSameDay(timestamp1: number, timestamp2: number): boolean {
        const date1 = new Date(timestamp1);
        const date2 = new Date(timestamp2);

        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    function useCard() {
        axios.post(API_URL + "/user/use_card", {
            "code": cardCode
        }).then(res => {
            if (res.data.code == 200) {
                toast({
                    title: "成功",
                    description: "成功兑换：" + res.data.data,
                })
                getUserInfo()
            } else {
                toast({
                    title: "失败",
                    description: res.data.message,
                })
            }
            getUserInfo()
        })
    }

    function changePwd() {

        if (isValidString(newPassword) == false) {
            toast({
                title: "请输入5-15位字母数字"
            })
            return
        }
        axios.post(API_URL + "/user/modify_account", {
            "password": newPassword
        }).then(res => {
            if (res.data.code == 200) {
                toast({
                    title: "修改成功",
                    description: res.data.data
                })
                getUserInfo()
            } else {
                toast({
                    title: "修改失败",
                    description: res.data.message,
                })
            }
            getUserInfo()
        })
    }

    function checkIn() {
        axios.get(API_URL + "/user/check_in?time=" + Date.now(), {}).then(res => {
            if (res.data.code == 120) {
                toast({
                    title: "失败",
                    description: "签到失败"
                })
            } else {
                toast({
                    title: "成功",
                    description: "签到成功"
                })
            }
            getUserInfo()
        })
    }

    function refreshVerify() {
        axios.get(API_URL + "/common/get_captcha?time=" + Date.now()).then((res) => {
            setVerifyUrl(res.data.data.image);
            setVerifyKey(res.data.data.key);
        })
    }

    function logout() {
        axios.get(API_URL + "/user/logout", {})
        clearToken()
        setIsLogin(false)
    }

    function login() {
        if (validatePhoneNumber(phone) == false) {
            toast({
                title: "请输入正确的手机号"
            })
            return
        }
        axios.post(API_URL + "/user/register_login?captchaKey=" + verifyKey + "&captchaCode=" + verifyCode, {
            phoneNumber: phone,
            password: password
        }).then(res => {
            if (res.data.message == "success") {
                const token = res.data.data.accessToken
                setToken(token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                setIsLogin(true)
                getUserInfo()
                setTabValue("profile")
            } else {
                // alert(res.data.message)
                toast({
                    title: res.data.message
                })
                if (res.data.message == "验证码错误") {
                    refreshVerify()
                }
            }
        })
    }
    function validatePhoneNumber(phoneNumber: string): boolean {
        // 这是一个简单的中国大陆手机号验证正则表达式（以1开头，第二位为3-9，后面9位为0-9的数字）
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phoneNumber);
    }

    function recharge() {
        if (Number(payCount) < 10) {
            toast({
                title: "最低充值额度为1元"
            })
            return
        }
        setIsRecharging(true)
        axios.post(API_URL + "/user/recharge", {
            "point": Number(payCount),
            "type": "ali"
        }).then(res => {
            if (res.data.code == 200) {
                window.location.href = res.data.data
            } else {
                setIsRecharging(false)
            }
        })
    }


    const [vipInfo, setVipInfo] = React.useState<VipInfo[]>([])

    function getVipInfo() {
        axios.get(API_URL + "/common/get_vip?time=" + Date.now()).then(res => {
            if (res.data.code == 200) {
                setVipInfo(res.data.data as VipInfo[])
            }
        })
    }

    useEffect(() => {
        if (isLogin) {
            getUserInfo()
            getVipInfo()
            setTabValue("profile")
        } else {
            setTabValue("login")
            refreshVerify()
        }
    }, [isLogin])

    return (
        <>
            <div className="h-screen bg-gradient-to-b from-amber-50 to-orange-200 w-full">
                <Tabs defaultValue="login" value={isLogin ? "profile" : "login"} onClick={(e) => {
                }}
                    className={"flex flex-col justify-center items-center"}>
                    <TabsContent value="login">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>注册/登录</CardTitle>
                                <CardDescription>
                                    输入手机号接收验证码注册/登录
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="phone">手机号</Label>
                                    <Input id="phone"
                                        value={phone} onChange={(e) => {
                                            setPhone(e.target.value)
                                        }} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="code">密码</Label>
                                    <Input id="password" type="password"
                                        value={password} onChange={(e) => {
                                            setPassword(e.target.value)
                                        }} />
                                </div>
                                <div className="space-y-1 flex flex-row ">
                                    <div>
                                        <Label htmlFor="code">验证码</Label>
                                        <Input id="verifyCode"
                                            value={verifyCode} onChange={(e) => {
                                                setVerifyCode(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <img src={verifyUrl} alt="Captcha" className="block mx-auto w-max[40]" onClick={
                                        () => {
                                            refreshVerify()
                                        }
                                    } />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={login}>注册/登录</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>个人信息</CardTitle>
                                <CardDescription>
                                    这里是你的个人信息页
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1 flex flex-row">
                                    <PhoneIcon></PhoneIcon>
                                    <Label htmlFor="terms" className="ml-2">手机号：{phone}</Label>
                                </div>
                                <div className="space-y-1 flex flex-row">
                                    <CoinIcon></CoinIcon>
                                    <Label htmlFor="terms" className="ml-2">白银虚拟币：{points.reward}</Label>
                                </div>
                                <div className="space-y-1 flex flex-row">
                                    <CoinIcon></CoinIcon>
                                    <Label htmlFor="terms" className="ml-2">真金虚拟币：{points.recharge}</Label>
                                </div>
                                <div className="space-y-1 flex flex-row">
                                    <CheckIcon></CheckIcon>
                                    <Label htmlFor="terms" className="ml-2">签到可得白银虚拟币：{checkNumber}</Label>
                                </div>
                                <div className="space-y-1 flex flex-row">
                                    <VIPIcon></VIPIcon>
                                    <Label htmlFor="terms" className="ml-2">会员等级：{level}</Label>
                                </div>
                                <div className="space-y-1 flex flex-row">
                                    <TimeIcon></TimeIcon>
                                    <Label htmlFor="terms" className="ml-2">到期时间：{expire}</Label>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex flex-col">
                                    <div className="flex">
                                        <div className="mr-2">
                                            <Button onClick={checkIn} className={""}
                                                disabled={isCheckIn}>{isCheckIn ? "已签" : "签到"}</Button>
                                        </div>
                                        <div className="">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className={""}>充值</Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>充值界面</DialogTitle>
                                                        <DialogDescription>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <Label htmlFor="payCount" className="mb-4">
                                                                要充值的真金 (1人民币等于10真金)
                                                            </Label>
                                                            <div className="flex flex-col">
                                                                <div className="flex flex-row mb-2">
                                                                    <CoinIcon></CoinIcon>
                                                                    <Label htmlFor="terms" className="">白银：{points.reward}</Label>
                                                                </div>
                                                                <div className="flex flex-row mb-4">
                                                                    <CoinIcon></CoinIcon>
                                                                    <Label htmlFor="terms" className="">真金：{points.recharge}</Label>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-row">
                                                                <Input id="payCount"
                                                                    value={payCount} type="number" onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        setPayCount(value);
                                                                    }} />
                                                                <Input className="ml-8" id="payCount"
                                                                    placeholder={((Number(payCount) / 10).toString() + "RMB").toString()} type="number" disabled />
                                                            </div>
                                                            <div className="flex flex-row items-center justify-center">
                                                                <Button size="lg" onClick={recharge} disabled={isRecharging} className="mt-4">
                                                                    {isRecharging ? "等待响应中" : "充值"}
                                                                </Button>
                                                                <Dialog>
                                                                    <DialogTrigger>
                                                                        <Button size="lg" variant={"secondary"} onClick={getRecharge} className="mt-4 ml-4">
                                                                            查看充值记录
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>充值记录</DialogTitle>
                                                                            <DialogDescription></DialogDescription>
                                                                        </DialogHeader>
                                                                        <ScrollArea className="h-[480px] rounded-md border p-4">
                                                                            <div className="flex items-center space-x-2">
                                                                                <Table>
                                                                                    <TableHeader>
                                                                                        <TableRow>
                                                                                            <TableHead className="text-center">日期</TableHead>
                                                                                            <TableHead className="text-center">真金</TableHead>
                                                                                            <TableHead className="text-center">金额</TableHead>
                                                                                            <TableHead className="text-center">状态</TableHead>
                                                                                            <TableHead className="text-center">支付链接</TableHead>
                                                                                            <TableHead className="text-center">订单号</TableHead>
                                                                                        </TableRow>
                                                                                    </TableHeader>
                                                                                    <TableBody>
                                                                                        {rechargeList.map((item, index) => (
                                                                                            <TableRow key={index}>
                                                                                                <TableCell className="text-center whitespace-nowrap">{formatTimestamp(item.creationTime)}</TableCell>
                                                                                                <TableCell className="text-center whitespace-nowrap">{item.point}</TableCell>
                                                                                                <TableCell className="text-center whitespace-nowrap">{item.money}</TableCell>
                                                                                                <TableCell className="text-center whitespace-nowrap">{item.state ? "✅" : "❌"}</TableCell>
                                                                                                <TableCell className="text-center whitespace-nowrap">
                                                                                                    <a href={item.url}>前往支付</a>
                                                                                                </TableCell>
                                                                                                <TableCell className="text-center whitespace-nowrap">{item.id}</TableCell>
                                                                                            </TableRow>
                                                                                        ))}
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </div>
                                                                        </ScrollArea>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="ml-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className={""}>月卡</Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>订购月卡</DialogTitle>
                                                        <DialogDescription>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="flex flex-col">
                                                                <div className="flex flex-row mb-2">
                                                                    <CoinIcon></CoinIcon>
                                                                    <Label htmlFor="terms" className="">白银虚拟币：{points.reward}</Label>
                                                                </div>
                                                                <div className="flex flex-row mb-2">
                                                                    <CoinIcon></CoinIcon>
                                                                    <Label htmlFor="terms" className="">真金虚拟币：{points.recharge}</Label>
                                                                </div>
                                                                <div className="flex flex-row">
                                                                    <VIPIcon></VIPIcon>
                                                                    <Label htmlFor="terms" className="">当前：{level}</Label>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Drawer open={open} onOpenChange={setOpen}>
                                                                    <DrawerTrigger asChild>
                                                                        <Button variant="outline" className="w-[150px] justify-start">
                                                                            {selectedStatus ? <>{selectedStatus.label}</> : <>+ 查看套餐</>}
                                                                        </Button>
                                                                    </DrawerTrigger>
                                                                    <DrawerContent>
                                                                        <div className="mt-4 border-t">
                                                                            <StatusList vipInfo={vipInfo} setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
                                                                        </div>
                                                                    </DrawerContent>
                                                                </Drawer>
                                                                <Button size="lg" onClick={openVIP} variant={"destructive"} className="px-4 mt-4 ml-1">
                                                                    开通
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className={"ml-2"}>礼包</Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>使用礼包码</DialogTitle>
                                                        <DialogDescription>
                                                            填入你获得的礼包码兑换白银
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="grid flex-1 gap-2">
                                                            <Label htmlFor="link" className="sr-only">
                                                                Link
                                                            </Label>
                                                            <Input
                                                                id="link"
                                                                defaultValue=""
                                                                value={cardCode}
                                                                onChange={(e) => {
                                                                    setCardCode(e.target.value)
                                                                }}
                                                            />
                                                        </div>
                                                        <Button type="submit" size="sm" onClick={useCard} className="px-3">
                                                            兑换
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="mt-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" className={""}>改密</Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>输入你的新密码</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="grid flex-1 gap-2">
                                                            <Label htmlFor="link" className="sr-only">
                                                                Link
                                                            </Label>
                                                            <Input
                                                                id="link"
                                                                defaultValue=""
                                                                value={newPassword}
                                                                onChange={(e) => {
                                                                    SetNewPassword(e.target.value)
                                                                }}
                                                            />
                                                        </div>
                                                        <Button type="submit" size="sm" onClick={changePwd} className="px-3">
                                                            确定
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="mt-4">
                                            <Button onClick={logout} variant={"destructive"} className="">退出</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div >
        </>
    )
}

function StatusList({
    setOpen,
    setSelectedStatus,
    vipInfo
}: {
    setOpen: (open: boolean) => void
    setSelectedStatus: (status: Status | null) => void,
    vipInfo: VipInfo[]
}) {

    function generateVipValue(name: string) {
        for (let i = 0; i < vipInfo.length; i++) {
            if (vipInfo[i].name == name) {
                const v = vipInfo[i]
                return `${v.name}月卡 - 签到可得:${v.checkInPoint}白银 - 售价:${v.price}真金`
            }
        }
    }
    return (
        <Command>
            {/* <CommandInput placeholder="搜索VIP类型..." /> */}
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {statuses.map((status) => (
                        <CommandItem
                            key={status.value}
                            value={status.value}
                            onSelect={(value) => {
                                setSelectedStatus(
                                    statuses.find((priority) => priority.value === value) || null
                                )
                                setOpen(false)
                            }}
                        >
                            {generateVipValue(status.label)}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
