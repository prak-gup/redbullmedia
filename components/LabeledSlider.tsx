import type { SliderColor } from '@/types'

interface LabeledSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  color?: SliderColor
  leftLabel?: string
  rightLabel?: string
}

const colorClasses: Record<SliderColor, string> = {
  orange: 'accent-orange-500',
  cyan: 'accent-cyan-500',
  indigo: 'accent-indigo-500',
  emerald: 'accent-emerald-500',
  red: 'accent-red-500',
  blue: 'accent-blue-500',
}

const textColors: Record<SliderColor, string> = {
  orange: 'text-orange-600',
  cyan: 'text-cyan-600',
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  red: 'text-red-600',
  blue: 'text-blue-600',
}

export default function LabeledSlider({
  label,
  value,
  onChange,
  min,
  max,
  color = 'orange',
  leftLabel,
  rightLabel,
}: LabeledSliderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className={`text-sm font-bold ${textColors[color]}`}>{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${colorClasses[color]}`}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-400">{leftLabel}</span>
        <span className="text-[10px] text-slate-400">{rightLabel}</span>
      </div>
    </div>
  )
}
