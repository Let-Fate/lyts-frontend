"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 五行颜色映射
const elementColors: Record<string, string> = {
  木: "text-green-600",
  火: "text-red-600",
  土: "text-yellow-600",
  金: "text-yellow-700",
  水: "text-blue-600"
}

// 天干地支五行对应
const elementMap: Record<string, string> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土",
  巳: "火", 午: "火", 未: "土", 申: "金", 酉: "金",
  戌: "土", 亥: "水"
}

// 优化后的大运和流年数据
export interface YearData {
  name: string;
  year: number;
}

export interface FateData {
  years: YearData[];
}

interface StemBranchButtonProps {
  value: string;
  year: number;
  isSelected: boolean;
  onClick: () => void;
}

const StemBranchButton: React.FC<StemBranchButtonProps> = ({ value, year, isSelected, onClick }) => {
  const [stem, branch] = value.split('')
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex flex-col items-center justify-center h-24 w-20 rounded-md transition-all duration-200 ${isSelected
        ? "bg-primary/15 shadow-md"
        : "hover:bg-secondary/20"
        }`}
    >
      <span className={`text-xs text-gray-500`}>{year}</span>
      <span className={`text-base font-bold ${elementColors[elementMap[stem]]}`}>{stem}</span>
      <span className={`text-base font-bold ${elementColors[elementMap[branch]]}`}>{branch}</span>
    </button>
  )
}

interface FateSelectorProps {
  onSelect: (fate: string, year: string, yearNumber: number) => void;
  fateData: Record<string, FateData>
}

const FateSelector: React.FC<FateSelectorProps> = ({ onSelect, fateData }) => {
  const [selectedFate, setSelectedFate] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")

  const handleFateSelect = (fate: string) => {
    setSelectedFate(fate)
    setSelectedYear("")
  }

  const handleYearSelect = (year: string, yearNumber: number) => {
    setSelectedYear(year)
    if (selectedFate) {
      onSelect(selectedFate, year, yearNumber)
    }
  }

  return (
    <Card className="mr-8">
      <CardHeader>
        {/* <CardTitle>大运流年选择器</CardTitle> */}
      </CardHeader>
      <CardContent className="">
        <div>
          <h3 className="text-base font-semibold mb-3">选择大运</h3>
          <div className="flex overflow-x-auto pb-2 gap-3  max-w-sm  mr-4 p-4">
            {Object.entries(fateData).map(([fate, data]) => (
              <StemBranchButton
                key={fate}
                value={fate}
                year={data.years[0].year}
                isSelected={selectedFate === fate}
                onClick={() => handleFateSelect(fate)}
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-3">选择流年</h3>
          <div className="flex overflow-x-auto pb-2 gap-3 max-w-sm mr-4 p-4">
            {selectedFate && fateData[selectedFate].years.map((yearData) => (
              <StemBranchButton
                key={yearData.name}
                value={yearData.name}
                year={yearData.year}
                isSelected={selectedYear === yearData.name}
                onClick={() => handleYearSelect(yearData.name, yearData.year)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface FateSelectorDialogProps {
  onSelect: (fate: string, year: string, yearNumber: number) => void;
  dayun: Record<string, FateData>
}

export const FateSelectorDialog: React.FC<FateSelectorDialogProps> = ({ onSelect, dayun }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [yearNumber, setYearNumber] = useState(0)

  const handleSelect = useCallback((fate: string, year: string, yearNumber: number) => {
    onSelect(fate, year, yearNumber)
    setYearNumber(yearNumber)
    setIsOpen(false)
  }, [onSelect])


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {yearNumber == 0 ? <Button variant="outline">流年选择</Button> : <Button variant="outline">当前流年:{yearNumber}</Button>}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>若只进行原局解析不用选择大运流年</DialogTitle>
        </DialogHeader>
        <FateSelector fateData={dayun} onSelect={handleSelect} />
      </DialogContent>
    </Dialog>
  )
}