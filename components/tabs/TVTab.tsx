'use client'

import { useMemo } from 'react'
import type { BaselineMetrics, OptimizedMetrics, RegionCode, OptimizedChannel } from '@/types'
import { TV_REGIONAL_DATA, TV_CHANNEL_DATA } from '@/data/constants'
import { formatCurrency, formatNumber } from '@/utils/formatting'
import ImpactScoreBar from '../ImpactScoreBar'

interface TVTabProps {
  hasOptimized: boolean
  optimizedMetrics: OptimizedMetrics | null
  selectedTVRegion: RegionCode
  onRegionChange: (region: RegionCode) => void
}

export default function TVTab({
  hasOptimized,
  optimizedMetrics,
  selectedTVRegion,
  onRegionChange,
}: TVTabProps) {
  const regionChannels = useMemo(() => {
    if (!optimizedMetrics) {
      return TV_CHANNEL_DATA.filter(c => c.Region === selectedTVRegion)
    }
    return optimizedMetrics.channels.filter(c => c.Region === selectedTVRegion)
  }, [selectedTVRegion, optimizedMetrics])

  const exportToCSV = () => {
    // Get all channels from all regions, not just selected region
    const allChannels = hasOptimized && optimizedMetrics
      ? optimizedMetrics.channels
      : TV_CHANNEL_DATA

    // Prepare CSV data
    const headers = [
      'Channel',
      'Region',
      'Genre',
      'Reach %',
      'Impact Score',
      'Current Spend',
      hasOptimized ? 'Optimized Spend' : 'ATC',
      ...(hasOptimized ? ['Status', 'Change %'] : [])
    ]

    const rows = allChannels.map((channel) => {
      const c = channel as OptimizedChannel
      const baseRow = [
        c.Channel,
        c.Region,
        c.Genre,
        c.ReachPct.toFixed(1),
        c.ImpactScore.toString(),
        c.Spend.toString(),
        hasOptimized 
          ? (c.newSpend || c.Spend).toString()
          : c.ATC.toString(),
      ]

      if (hasOptimized) {
        baseRow.push(
          c.status || 'MAINTAIN',
          c.spendChange !== undefined ? c.spendChange.toFixed(1) : '0'
        )
      }

      return baseRow
    })

    // Sort by Region, then by Channel name for better organization
    rows.sort((a, b) => {
      const regionCompare = a[1].localeCompare(b[1]) // Region is index 1
      if (regionCompare !== 0) return regionCompare
      return a[0].localeCompare(b[0]) // Channel is index 0
    })

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `TV_Channels_All_Markets_${hasOptimized ? 'Optimized' : 'Baseline'}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {!hasOptimized && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
          <span className="text-amber-500">⚠️</span>
          <p className="text-amber-800 text-xs">Run optimization from Summary tab to see changes.</p>
        </div>
      )}
      
      {/* Region Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">TV Regional Performance</h3>
          <div className="flex gap-1">
            {(['HSM', 'AP', 'TN', 'Kar', 'Ker', 'WB', 'Sports', 'Others'] as RegionCode[]).map(region => (
              <button
                key={region}
                onClick={() => onRegionChange(region)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                  selectedTVRegion === region
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
        
        {/* Region KPIs */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <p className="text-[10px] text-slate-500">Channels</p>
            <p className="text-lg font-bold text-indigo-600">{regionChannels.length}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <p className="text-[10px] text-slate-500">Spend</p>
            <p className="text-sm font-bold text-slate-800">
              {formatCurrency(hasOptimized && optimizedMetrics && optimizedMetrics.regions[selectedTVRegion]
                ? optimizedMetrics.regions[selectedTVRegion].newSpend
                : TV_REGIONAL_DATA[selectedTVRegion]?.Spend || 0)}
            </p>
            {hasOptimized && optimizedMetrics && optimizedMetrics.regions[selectedTVRegion] && (
              <p className={`text-[10px] font-medium ${optimizedMetrics.regions[selectedTVRegion].spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {optimizedMetrics.regions[selectedTVRegion].spendChange >= 0 ? '+' : ''}{optimizedMetrics.regions[selectedTVRegion].spendChange.toFixed(1)}%
              </p>
            )}
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <p className="text-[10px] text-slate-500">ATC</p>
            <p className="text-sm font-bold text-emerald-600">
              {formatNumber(hasOptimized && optimizedMetrics && optimizedMetrics.regions[selectedTVRegion]
                ? optimizedMetrics.regions[selectedTVRegion].newATC
                : TV_REGIONAL_DATA[selectedTVRegion]?.ATC || 0)}
            </p>
            {hasOptimized && optimizedMetrics && optimizedMetrics.regions[selectedTVRegion] && (
              <p className={`text-[10px] font-medium ${optimizedMetrics.regions[selectedTVRegion].atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {optimizedMetrics.regions[selectedTVRegion].atcChange >= 0 ? '+' : ''}{optimizedMetrics.regions[selectedTVRegion].atcChange.toFixed(1)}%
              </p>
            )}
          </div>
          <div className="bg-cyan-50 rounded-lg p-3 text-center">
            <p className="text-[10px] text-slate-500">Reach</p>
            <p className="text-sm font-bold text-cyan-600">{TV_REGIONAL_DATA[selectedTVRegion]?.ReachPct || 0}%</p>
          </div>
        </div>
      </div>
      
      {/* All Regions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">All Regions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 uppercase">
                <th className="text-left py-2 px-4">Region</th>
                <th className="text-right py-2 px-4">Channels</th>
                <th className="text-right py-2 px-4">Current Spend</th>
                <th className="text-right py-2 px-4">Optimized</th>
                <th className="text-right py-2 px-4">Δ Spend</th>
                <th className="text-right py-2 px-4">Δ ATC</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(TV_REGIONAL_DATA).map(([region, data]) => {
                const opt = hasOptimized && optimizedMetrics ? optimizedMetrics.regions[region] : null
                return (
                  <tr 
                    key={region} 
                    className={`border-b border-slate-100 cursor-pointer ${
                      selectedTVRegion === region ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => onRegionChange(region as RegionCode)}
                  >
                    <td className="py-2 px-4 font-medium text-slate-800">{region}</td>
                    <td className="py-2 px-4 text-right text-slate-800">{data.Channels}</td>
                    <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(data.Spend)}</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-800">{opt ? formatCurrency(opt.newSpend) : '-'}</td>
                    <td className={`py-2 px-4 text-right font-semibold ${opt ? (opt.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-600'}`}>
                      {opt ? `${opt.spendChange >= 0 ? '+' : ''}${opt.spendChange.toFixed(1)}%` : '-'}
                    </td>
                    <td className={`py-2 px-4 text-right font-semibold ${opt ? (opt.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-600'}`}>
                      {opt ? `${opt.atcChange >= 0 ? '+' : ''}${opt.atcChange.toFixed(1)}%` : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Channel Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">{selectedTVRegion} Channels</h3>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded text-[10px] font-medium transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 uppercase">
                <th className="text-left py-2 px-3">Channel</th>
                {hasOptimized && <th className="text-left py-2 px-3">Status</th>}
                <th className="text-left py-2 px-3">Genre</th>
                <th className="text-right py-2 px-3">Reach</th>
                <th className="text-center py-2 px-3">Impact</th>
                <th className="text-right py-2 px-3">Current Spend</th>
                <th className="text-right py-2 px-3">{hasOptimized ? 'Optimized' : 'ATC'}</th>
                {hasOptimized && <th className="text-right py-2 px-3">Δ</th>}
              </tr>
            </thead>
            <tbody>
              {regionChannels.map((c, i) => {
                const channel = c as OptimizedChannel
                const showChange = hasOptimized && channel.status !== 'MAINTAIN'
                
                return (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-3 font-medium capitalize text-slate-800">{channel.Channel}</td>
                    {hasOptimized && (
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          channel.status === 'INCREASE' ? 'bg-emerald-100 text-emerald-700' :
                          channel.status === 'DECREASE' ? 'bg-rose-100 text-rose-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {channel.status === 'INCREASE' && '↑'}
                          {channel.status === 'DECREASE' && '↓'}
                          {channel.status === 'MAINTAIN' && '—'}
                          {channel.status}
                        </span>
                      </td>
                    )}
                    <td className="py-2 px-3 text-slate-600 capitalize">{channel.Genre}</td>
                    <td className="py-2 px-3 text-right text-slate-800">{channel.ReachPct.toFixed(1)}%</td>
                    <td className="py-2 px-3">
                      <ImpactScoreBar score={channel.ImpactScore} />
                    </td>
                    <td className="py-2 px-3 text-right text-slate-800">{formatCurrency(channel.Spend)}</td>
                    <td className="py-2 px-3 text-right font-medium text-slate-800">
                      {hasOptimized 
                        ? formatCurrency(channel.newSpend || channel.Spend)
                        : channel.ATC
                      }
                    </td>
                    {hasOptimized && (
                      <td className={`py-2 px-3 text-right font-semibold ${
                        showChange 
                          ? (channel.spendChange && channel.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500')
                          : 'text-slate-600'
                      }`}>
                        {showChange && channel.spendChange !== undefined
                          ? `${channel.spendChange >= 0 ? '+' : ''}${channel.spendChange.toFixed(1)}%`
                          : '—'
                        }
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
