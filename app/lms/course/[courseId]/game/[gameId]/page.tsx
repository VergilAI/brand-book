'use client'

import { use } from 'react'
import { GameInterface } from '@/components/lms/game-interface'

interface GamePageProps {
  params: Promise<{
    courseId: string
    gameId: string
  }>
}

export default function GamePage({ params }: GamePageProps) {
  const { courseId, gameId } = use(params)

  return (
    <GameInterface 
      courseId={courseId} 
      gameId={gameId} 
    />
  )
}