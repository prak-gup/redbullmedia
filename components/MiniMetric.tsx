interface MiniMetricProps {
  label: string
  value: string
  change?: number
  small?: boolean
}

export default function MiniMetric({ label, value, change, small = false }: MiniMetricProps) {
  return (
    <div className={small ? 'text-center' : ''}>
      <p className="text-[10px] text-slate-500 uppercase">{label}</p>
      <p className={`font-bold text-slate-800 ${small ? 'text-sm' : 'text-lg'}`}>{value}</p>
      {change !== undefined && (
        <p className={`text-[10px] font-semibold ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </p>
      )}
    </div>
  )
}
