import { getImpactScoreStyle } from '@/utils/impactScore'

interface ImpactScoreBarProps {
  score: number
}

export default function ImpactScoreBar({ score }: ImpactScoreBarProps) {
  const style = getImpactScoreStyle(score)
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full ${style.bg} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold ${style.color} w-6`}>{score}</span>
    </div>
  )
}
