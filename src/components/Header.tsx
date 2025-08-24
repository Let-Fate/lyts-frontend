import { Brain, Sparkles, Book, Heart } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-red-400 to-yellow-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-0">
            灵钥通枢</h1>
        </div>

        <p className="text-lg sm:text-xl text-center mb-4 sm:mb-8">

        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="flex flex-col items-center">
            <Brain className="w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2" />
            <h2 className="text-base sm:text-lg font-semibold">智能</h2>
            <p className="text-xs sm:text-sm">经过大数据调整,拥有强大的玄学素养</p>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2" />
            <h2 className="text-base sm:text-lg font-semibold">思维</h2>
            <p className="text-xs sm:text-sm">具有灵活的思维能力，不受情绪影响</p>
          </div>
          <div className="flex flex-col items-center">
            <Book className="w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2" />
            <h2 className="text-base sm:text-lg font-semibold">知识</h2>
            <p className="text-xs sm:text-sm">拥有巨大的数据库，我不缺乏知识</p>
          </div>
          <div className="flex flex-col items-center">
            <Heart className="w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2" />
            <h2 className="text-base sm:text-lg font-semibold">同情</h2>
            <p className="text-xs sm:text-sm">懂得你的苦楚，会照顾好你的情绪</p>
          </div>
        </div>
      </div>
    </header>
  )
}

