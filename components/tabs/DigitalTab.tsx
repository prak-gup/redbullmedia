'use client'

import type { BaselineMetrics, OptimizedMetrics } from '@/types'
import { formatCurrency, formatNumber } from '@/utils/formatting'

interface DigitalTabProps {
  hasOptimized: boolean
  optimizedMetrics: OptimizedMetrics | null
  baselineMetrics: BaselineMetrics
}

export default function DigitalTab({
  hasOptimized,
  optimizedMetrics,
  baselineMetrics,
}: DigitalTabProps) {
  return (
    <div className="space-y-4">
      {!hasOptimized && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
          <span className="text-amber-500">⚠️</span>
          <p className="text-amber-800 text-xs">Run optimization from Summary tab to see changes.</p>
        </div>
      )}
      
      {/* Digital Summary */}
      <div className="grid grid-cols-2 gap-4">
        {/* YouTube */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">▶️</span>
              <div>
                <h3 className="text-sm font-semibold text-white">YouTube</h3>
                <p className="text-red-200 text-[10px]">High efficiency platform</p>
              </div>
            </div>
            {hasOptimized && optimizedMetrics && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                optimizedMetrics.youtube.spendChange >= 0 ? 'bg-white/20 text-white' : 'bg-rose-600 text-white'
              }`}>
                {optimizedMetrics.youtube.spendChange >= 0 ? '↑' : '↓'} {Math.abs(optimizedMetrics.youtube.spendChange).toFixed(1)}%
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Spend</p>
                <p className="text-xl font-bold text-slate-800">
                  {formatCurrency(hasOptimized && optimizedMetrics ? optimizedMetrics.youtube.spend : baselineMetrics.youtube.Spend)}
                </p>
                {hasOptimized && optimizedMetrics && (
                  <p className="text-[10px] text-slate-400">was {formatCurrency(baselineMetrics.youtube.Spend)}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">ATC</p>
                <p className="text-xl font-bold text-slate-800">
                  {formatNumber(hasOptimized && optimizedMetrics ? optimizedMetrics.youtube.atc : baselineMetrics.youtube.ATC)}
                </p>
                {hasOptimized && optimizedMetrics && (
                  <p className={`text-[10px] font-medium ${optimizedMetrics.youtube.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {optimizedMetrics.youtube.atcChange >= 0 ? '+' : ''}{optimizedMetrics.youtube.atcChange.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* JioHotstar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <h3 className="text-sm font-semibold text-white">JioHotstar</h3>
                <p className="text-blue-200 text-[10px]">Premium content</p>
              </div>
            </div>
            {hasOptimized && optimizedMetrics && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                optimizedMetrics.jiohotstar.spendChange >= 0 ? 'bg-white/20 text-white' : 'bg-rose-600 text-white'
              }`}>
                {optimizedMetrics.jiohotstar.spendChange >= 0 ? '↑' : '↓'} {Math.abs(optimizedMetrics.jiohotstar.spendChange).toFixed(1)}%
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Spend</p>
                <p className="text-xl font-bold text-slate-800">
                  {formatCurrency(hasOptimized && optimizedMetrics ? optimizedMetrics.jiohotstar.spend : baselineMetrics.jiohotstar.Spend)}
                </p>
                {hasOptimized && optimizedMetrics && (
                  <p className="text-[10px] text-slate-400">was {formatCurrency(baselineMetrics.jiohotstar.Spend)}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">ATC</p>
                <p className="text-xl font-bold text-slate-800">
                  {formatNumber(hasOptimized && optimizedMetrics ? optimizedMetrics.jiohotstar.atc : baselineMetrics.jiohotstar.ATC)}
                </p>
                {hasOptimized && optimizedMetrics && (
                  <p className={`text-[10px] font-medium ${optimizedMetrics.jiohotstar.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {optimizedMetrics.jiohotstar.atcChange >= 0 ? '+' : ''}{optimizedMetrics.jiohotstar.atcChange.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">Platform Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 uppercase">
                <th className="text-left py-2 px-4">Platform</th>
                <th className="text-right py-2 px-4">Current Spend</th>
                <th className="text-right py-2 px-4">Optimized</th>
                <th className="text-right py-2 px-4">Δ Spend</th>
                <th className="text-right py-2 px-4">Current ATC</th>
                <th className="text-right py-2 px-4">Optimized</th>
                <th className="text-right py-2 px-4">Δ ATC</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 font-medium text-red-600">▶️ YouTube</td>
                <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(baselineMetrics.youtube.Spend)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{hasOptimized && optimizedMetrics ? formatCurrency(optimizedMetrics.youtube.spend) : '-'}</td>
                <td className={`py-2 px-4 text-right font-semibold ${hasOptimized && optimizedMetrics ? (optimizedMetrics.youtube.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-600'}`}>
                  {hasOptimized && optimizedMetrics ? `${optimizedMetrics.youtube.spendChange >= 0 ? '+' : ''}${optimizedMetrics.youtube.spendChange.toFixed(1)}%` : '-'}
                </td>
                <td className="py-2 px-4 text-right text-slate-800">{formatNumber(baselineMetrics.youtube.ATC)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{hasOptimized && optimizedMetrics ? formatNumber(optimizedMetrics.youtube.atc) : '-'}</td>
                <td className={`py-2 px-4 text-right font-semibold ${hasOptimized && optimizedMetrics ? (optimizedMetrics.youtube.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-600'}`}>
                  {hasOptimized && optimizedMetrics ? `${optimizedMetrics.youtube.atcChange >= 0 ? '+' : ''}${optimizedMetrics.youtube.atcChange.toFixed(1)}%` : '-'}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 font-medium text-blue-600">⭐ JioHotstar</td>
                <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(baselineMetrics.jiohotstar.Spend)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{hasOptimized && optimizedMetrics ? formatCurrency(optimizedMetrics.jiohotstar.spend) : '-'}</td>
                <td className={`py-2 px-4 text-right font-semibold ${hasOptimized && optimizedMetrics ? (optimizedMetrics.jiohotstar.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-600'}`}>
                  {hasOptimized && optimizedMetrics ? `${optimizedMetrics.jiohotstar.spendChange >= 0 ? '+' : ''}${optimizedMetrics.jiohotstar.spendChange.toFixed(1)}%` : '-'}
                </td>
                <td className="py-2 px-4 text-right text-slate-800">{formatNumber(baselineMetrics.jiohotstar.ATC)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{hasOptimized && optimizedMetrics ? formatNumber(optimizedMetrics.jiohotstar.atc) : '-'}</td>
                <td className={`py-2 px-4 text-right font-semibold ${hasOptimized && optimizedMetrics ? (optimizedMetrics.jiohotstar.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-600'}`}>
                  {hasOptimized && optimizedMetrics ? `${optimizedMetrics.jiohotstar.atcChange >= 0 ? '+' : ''}${optimizedMetrics.jiohotstar.atcChange.toFixed(1)}%` : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Insight */}
      <div className="bg-slate-800 rounded-xl p-4 text-white">
        <h4 className="text-xs font-semibold mb-2">💡 Efficiency Insight</h4>
        <p className="text-slate-300 text-xs">
          YouTube delivers <span className="text-emerald-400 font-semibold">4.2x better efficiency</span> than JioHotstar 
          for ATC conversions. Optimal split balances efficiency with incremental reach.
        </p>
      </div>
    </div>
  )
}
