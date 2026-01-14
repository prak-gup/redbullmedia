'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { BaselineMetrics, OptimizedMetrics, PieDataItem } from '@/types'
import { formatCurrency, formatNumber } from '@/utils/formatting'
import LabeledSlider from '../LabeledSlider'
import MiniMetric from '../MiniMetric'

interface SummaryTabProps {
  hasOptimized: boolean
  optimizedMetrics: OptimizedMetrics | null
  baselineMetrics: BaselineMetrics
  tvDigitalSplit: number
  ytJhsSplit: number
  tvIntensity: number
  tvThreshold: number
  syncEnabled: boolean
  syncBudget: number
  onTvDigitalSplitChange: (value: number) => void
  onYtJhsSplitChange: (value: number) => void
  onTvIntensityChange: (value: number) => void
  onTvThresholdChange: (value: number) => void
  onSyncEnabledChange: (value: boolean) => void
  onSyncBudgetChange: (value: number) => void
  onOptimizationChange: () => void
}

export default function SummaryTab({
  hasOptimized,
  optimizedMetrics,
  baselineMetrics,
  tvDigitalSplit,
  ytJhsSplit,
  tvIntensity,
  tvThreshold,
  syncEnabled,
  syncBudget,
  onTvDigitalSplitChange,
  onYtJhsSplitChange,
  onTvIntensityChange,
  onTvThresholdChange,
  onSyncEnabledChange,
  onSyncBudgetChange,
  onOptimizationChange,
}: SummaryTabProps) {
  const summaryPieData = useMemo<PieDataItem[]>(() => {
    if (hasOptimized && optimizedMetrics) {
      const data = [
        { name: 'TV', value: optimizedMetrics.tv.spend, color: '#6366f1' },
        { name: 'YouTube', value: optimizedMetrics.youtube.spend, color: '#ef4444' },
        { name: 'JioHotstar', value: optimizedMetrics.jiohotstar.spend, color: '#3b82f6' },
      ]
      if (optimizedMetrics.sync) {
        data.push({ name: 'SYNC', value: optimizedMetrics.sync.spend, color: '#10b981' })
      }
      return data
    }
    return [
      { name: 'TV', value: baselineMetrics.tv.spend, color: '#6366f1' },
      { name: 'YouTube', value: baselineMetrics.youtube.Spend, color: '#ef4444' },
      { name: 'JioHotstar', value: baselineMetrics.jiohotstar.Spend, color: '#3b82f6' },
    ]
  }, [hasOptimized, optimizedMetrics, baselineMetrics])

  return (
    <div className="space-y-4">
      {/* Impact Banner */}
      {hasOptimized && optimizedMetrics && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs uppercase">Optimization Impact</p>
              <p className="text-3xl font-bold">
                {optimizedMetrics.total.atcLift >= 0 ? '+' : ''}{optimizedMetrics.total.atcLift.toFixed(1)}% ATC
              </p>
              <p className="text-emerald-100 text-sm">
                {optimizedMetrics.total.atcGain >= 0 ? '+' : ''}{optimizedMetrics.total.atcGain.toLocaleString()} incremental
              </p>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-xs">Budget Neutral</p>
              <p className="text-xl font-bold">{formatCurrency(baselineMetrics.total.spend)}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content - Controls Left, Summary Right */}
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT: Controls */}
        <div className="col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-orange-600 text-xs">⚙</span>
            Optimization Controls
          </h3>
          
          {/* Platform Split */}
          <div className="mb-5 pb-4 border-b border-slate-100">
            <p className="text-[10px] text-slate-500 uppercase mb-2 font-medium">Platform Budget</p>
            <LabeledSlider
              label="TV / Digital Split"
              value={tvDigitalSplit}
              onChange={(v) => { onTvDigitalSplitChange(v); if(hasOptimized) onOptimizationChange(); }}
              min={50}
              max={95}
              color="indigo"
              leftLabel={`Digital ${100-tvDigitalSplit}%`}
              rightLabel={`TV ${tvDigitalSplit}%`}
            />
          </div>
          
          {/* Digital Split */}
          <div className="mb-5 pb-4 border-b border-slate-100">
            <p className="text-[10px] text-slate-500 uppercase mb-2 font-medium">Digital Budget</p>
            <LabeledSlider
              label="YouTube / JioHotstar Split"
              value={ytJhsSplit}
              onChange={(v) => { onYtJhsSplitChange(v); if(hasOptimized) onOptimizationChange(); }}
              min={30}
              max={90}
              color="red"
              leftLabel={`JHS ${100-ytJhsSplit}%`}
              rightLabel={`YT ${ytJhsSplit}%`}
            />
          </div>
          
          {/* TV Controls */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase mb-2 font-medium">TV Channel Optimization</p>
            <LabeledSlider
              label="Optimization Intensity"
              value={tvIntensity}
              onChange={(v) => { onTvIntensityChange(v); if(hasOptimized) onOptimizationChange(); }}
              min={5}
              max={30}
              color="orange"
              leftLabel="Conservative"
              rightLabel="Aggressive"
            />
            <LabeledSlider
              label="Protection Threshold"
              value={tvThreshold}
              onChange={(v) => { onTvThresholdChange(v); if(hasOptimized) onOptimizationChange(); }}
              min={50}
              max={90}
              color="cyan"
              leftLabel="Fewer Protected"
              rightLabel="More Protected"
            />
          </div>
          
          {/* SYNC Controls */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">⚡</span>
                <span className="text-xs font-semibold text-slate-700">Enable SYNC</span>
              </div>
              <button
                onClick={() => { onSyncEnabledChange(!syncEnabled); if(hasOptimized) onOptimizationChange(); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  syncEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  syncEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            {syncEnabled && (
              <div className="bg-emerald-900/10 rounded-lg p-3 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-emerald-700 font-medium">SYNC Budget (Monthly)</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {syncBudget >= 10000000 
                      ? `₹${(syncBudget / 10000000).toFixed(2)} Cr`
                      : `₹${(syncBudget / 100000).toFixed(0)} L`
                    }
                  </span>
                </div>
                <input
                  type="range"
                  min={2000000}
                  max={14000000}
                  step={500000}
                  value={syncBudget}
                  onChange={(e) => { onSyncBudgetChange(parseInt(e.target.value)); if(hasOptimized) onOptimizationChange(); }}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-emerald-600">₹20 L</span>
                  <span className="text-[10px] text-emerald-600">₹1.40 Cr</span>
                </div>
                <p className="text-[10px] text-emerald-600 mt-2 italic">Budget sourced from TV reduction</p>
              </div>
            )}
          </div>
        </div>
        
        {/* RIGHT: Summary */}
        <div className="col-span-7 space-y-4">
          {/* Platform Cards */}
          <div className={`grid gap-3 ${syncEnabled && hasOptimized && optimizedMetrics?.sync ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {/* TV */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600">📺</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Television</p>
                  <p className="text-[10px] text-slate-400">108 channels</p>
                </div>
              </div>
              <div className="space-y-2">
                <MiniMetric 
                  label="Spend" 
                  value={formatCurrency(hasOptimized && optimizedMetrics ? optimizedMetrics.tv.spend : baselineMetrics.tv.spend)}
                  change={hasOptimized && optimizedMetrics ? optimizedMetrics.tv.spendChange : undefined}
                />
                <MiniMetric 
                  label="ATC" 
                  value={formatNumber(hasOptimized && optimizedMetrics ? optimizedMetrics.tv.atc : baselineMetrics.tv.atc)}
                  change={hasOptimized && optimizedMetrics ? optimizedMetrics.tv.atcChange : undefined}
                />
              </div>
            </div>
            
            {/* YouTube */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <span className="text-red-600">▶</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">YouTube</p>
                  <p className="text-[10px] text-slate-400">Digital</p>
                </div>
              </div>
              <div className="space-y-2">
                <MiniMetric 
                  label="Spend" 
                  value={formatCurrency(hasOptimized && optimizedMetrics ? optimizedMetrics.youtube.spend : baselineMetrics.youtube.Spend)}
                  change={hasOptimized && optimizedMetrics ? optimizedMetrics.youtube.spendChange : undefined}
                />
                <MiniMetric 
                  label="ATC" 
                  value={formatNumber(hasOptimized && optimizedMetrics ? optimizedMetrics.youtube.atc : baselineMetrics.youtube.ATC)}
                  change={hasOptimized && optimizedMetrics ? optimizedMetrics.youtube.atcChange : undefined}
                />
              </div>
            </div>
            
            {/* JioHotstar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600">⭐</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">JioHotstar</p>
                  <p className="text-[10px] text-slate-400">Digital</p>
                </div>
              </div>
              <div className="space-y-2">
                <MiniMetric 
                  label="Spend" 
                  value={formatCurrency(hasOptimized && optimizedMetrics ? optimizedMetrics.jiohotstar.spend : baselineMetrics.jiohotstar.Spend)}
                  change={hasOptimized && optimizedMetrics ? optimizedMetrics.jiohotstar.spendChange : undefined}
                />
                <MiniMetric 
                  label="ATC" 
                  value={formatNumber(hasOptimized && optimizedMetrics ? optimizedMetrics.jiohotstar.atc : baselineMetrics.jiohotstar.ATC)}
                  change={hasOptimized && optimizedMetrics ? optimizedMetrics.jiohotstar.atcChange : undefined}
                />
              </div>
            </div>
            
            {/* SYNC - Only show when enabled and optimized */}
            {syncEnabled && hasOptimized && optimizedMetrics?.sync && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <span className="text-white text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-800">SYNC</p>
                    <p className="text-[10px] text-emerald-600">NEW</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <MiniMetric 
                    label="Spend" 
                    value={formatCurrency(optimizedMetrics.sync.spend)}
                  />
                  <MiniMetric 
                    label="ATC" 
                    value={formatNumber(optimizedMetrics.sync.atc)}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Budget Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h4 className="text-xs font-semibold text-slate-700 mb-3">Budget Distribution</h4>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summaryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
                      dataKey="value"
                    >
                      {summaryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {summaryPieData.map((item, i) => {
                  const total = summaryPieData.reduce((s, d) => s + d.value, 0)
                  const pct = ((item.value / total) * 100).toFixed(1)
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-slate-600">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-800">{formatCurrency(item.value)}</span>
                        <span className="text-[10px] text-slate-400 ml-2">({pct}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Totals */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800 rounded-xl p-3 text-white text-center">
              <p className="text-[10px] text-slate-400 uppercase">Total Spend</p>
              <p className="text-lg font-bold">{formatCurrency(baselineMetrics.total.spend)}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-white text-center">
              <p className="text-[10px] text-slate-400 uppercase">Baseline ATC</p>
              <p className="text-lg font-bold">{formatNumber(baselineMetrics.total.atc)}</p>
            </div>
            <div className={`rounded-xl p-3 text-white text-center ${hasOptimized ? 'bg-emerald-600' : 'bg-slate-600'}`}>
              <p className="text-[10px] text-emerald-200 uppercase">Optimized ATC</p>
              <p className="text-lg font-bold">
                {hasOptimized && optimizedMetrics ? formatNumber(optimizedMetrics.total.atc) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
