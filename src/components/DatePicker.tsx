import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


export interface DateData {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
}

export function DatePicker({ emit, gender, date }: { emit: React.Dispatch<React.SetStateAction<DateData>>, gender: React.Dispatch<React.SetStateAction<string>>, date: DateData }) {
    const [year, setYear] = React.useState<number>(date.year);
    const [month, setMonth] = React.useState<number>(date.month);
    const [day, setDay] = React.useState<number>(date.day);
    const [hour, setHour] = React.useState<number>(date.hour);
    const [minute, setMinute] = React.useState<number>(date.minute);

    const [sex, setSex] = React.useState<string>("男");

    React.useEffect(() => {
        console.log(year, month, day, hour, minute)
        emit({ year, month, day, hour, minute })
    }, [year, month, day, hour, minute])

    React.useEffect(() => {
        gender(sex)
    }, [sex])

    return (
        <div className="flex space-x-4">
            <div>
                <div className="flex flex-row items-center">
                    <label className="mb-1 mr-2">年</label>
                    <DateSelect num={year} setNum={setYear} start={1950} end={2050}></DateSelect>
                </div>
                <div className="flex flex-row items-center mt-4">
                    <label className="mb-1 mr-2">时</label>
                    <DateSelect num={hour} setNum={setHour} start={1} end={24}></DateSelect>
                </div>
            </div>
            <div>
                <div className="flex flex-row items-center">
                    <label className="mb-1 mr-2">月</label>
                    <DateSelect num={month} setNum={setMonth} start={1} end={12}></DateSelect>
                </div>
                <div className="flex flex-row items-center  mt-4">
                    <label className="mb-1 mr-2">分</label>
                    <DateSelect num={minute} setNum={setMinute} start={0} end={60}></DateSelect>
                </div>
            </div>
            <div>
                <div className="flex flex-row items-center">
                    <label className="mb-1 mr-2">日</label>
                    <DateSelect num={day} setNum={setDay} start={1} end={31}></DateSelect>
                </div>
                <div className="flex items-center space-x-2 mt-6 ml-2">
                    <Switch id="airplane-mode" checked={sex == "男"} onCheckedChange={(checked: boolean) => {
                        setSex(checked ? "男" : "女")
                    }} />
                    <Label htmlFor="airplane-mode">{sex}</Label>
                </div>
            </div>
        </div>
    );
}
function DateSelect({ start, end, num, setNum }: { start: number, end: number, num: number, setNum: React.Dispatch<React.SetStateAction<number>> }) {
    const [value, setValue] = React.useState<number[]>([]);
    function generateOptions() {
        const options = [];
        for (let i = start; i <= end; i++) {
            options.push(
                i
            );
        }
        setValue(options);
    }

    React.useEffect(() => {
        generateOptions();
        console.log(num)
    }, []);
    return (
        <Select value={num.toString()} onValueChange={(e) => {
            setNum(Number(e))
        }}>
            <SelectTrigger className="">
                <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
                {value.map((item) => (
                    <SelectItem key={item} value={item.toString()}>
                        {item}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}