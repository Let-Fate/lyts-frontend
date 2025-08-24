import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageScatterProps {
  imageSrc: string;
  clicksToRestore: number;
  pieceCount: number;
  emit: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ImageScatterComponent({
  imageSrc = '/placeholder.svg?height=400&width=600',
  clicksToRestore = 5,
  pieceCount = 36,
  emit
}: ImageScatterProps) {
  const [scattered, setScattered] = useState(true)
  const [clickCount, setClickCount] = useState(0)
  const [pieces, setPieces] = useState<{ x: number; y: number; rotation: number; collected: boolean }[]>([])
  const [showFinalAnimation, setShowFinalAnimation] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)

  useEffect(() => {
    const newPieces = Array.from({ length: pieceCount }, () => {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 40 + 10 // 10% to 50% of the screen width/height
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotation: Math.random() * 360,
        collected: false,
      }
    })
    setPieces(newPieces)
  }, [pieceCount])

  const handleClick = (index: number) => {
    if (scattered && !pieces[index].collected) {
      setClickCount(prev => {
        const newCount = prev + 1
        if (newCount >= clicksToRestore) {
          setScattered(false)
          setShowFinalAnimation(true)
          setPieces(prevPieces => prevPieces.map(piece => ({ ...piece, collected: true })))
          setTimeout(() => {
            setShowFinalAnimation(false)
            setShowFullImage(true)
          }, 1000)
          emit(true)
          return newCount
        }
        setPieces(prevPieces => prevPieces.map((piece, i) =>
          i === index ? { ...piece, collected: true } : piece
        ))
        return newCount
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center overflow-hidden mb-20">
      <div className="relative w-screen h-screen">
        <AnimatePresence>
          {!showFullImage && pieces.map((piece, index) => (
            <motion.div
              key={index}
              className="absolute overflow-hidden cursor-pointer"
              style={{
                width: '100px', // Adjust the size of each card as needed
                height: '150px', // Adjust the size of each card as needed
                top: `calc(50% - 75px)`, // Adjust the position of each card as needed
                left: `calc(50% - 50px)`, // Adjust the position of each card as needed
                transform: `translate(${piece.x}vw, ${piece.y}vh) rotate(${piece.rotation}deg)`,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow to make edges smoother
                borderRadius: '8px', // Add border radius to make edges smoother
              }}
              initial={{
                x: `${piece.x}vw`,
                y: `${piece.y}vh`,
                rotate: piece.rotation,
                opacity: 1
              }}
              animate={
                piece.collected
                  ? { scale: 0, opacity: 0 }
                  : scattered
                    ? { x: `${piece.x}vw`, y: `${piece.y}vh`, rotate: piece.rotation, opacity: 1 }
                    : { x: 0, y: 0, rotate: 0, opacity: 1 }
              }
              exit={showFinalAnimation ? {
                x: `${(Math.random() - 0.5) * 200}vw`,
                y: `${(Math.random() - 0.5) * 200}vh`,
                rotate: Math.random() * 720 - 360,
                opacity: 0,
                transition: { duration: 0.5, ease: "easeInOut" }
              } : {}}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={() => handleClick(index)}
            >
              <img
                src={imageSrc}
                alt="Card"
                className="absolute object-cover"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px', // Add border radius to make edges smoother
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {showFullImage && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={() => { emit(true) }}
            >
              <img src={imageSrc} alt="Full image" className="max-w-full max-h-full object-contain" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}