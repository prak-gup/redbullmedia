'use client'

import { useState, useMemo } from 'react'
import type { BaselineMetrics, OptimizedChannel } from '@/types'
import { DIGITAL_DATA, TV_REGIONAL_DATA, TV_CHANNEL_DATA, getSyncMetrics } from '@/data/constants'
import { formatCurrency, formatNumber } from '@/utils/formatting'
import ImpactScoreBar from '../ImpactScoreBar'

interface OptimalPlanTabProps {
  baselineMetrics: BaselineMetrics
}

interface OptimalChannel extends OptimizedChannel {
  recommendedSpend: number
  recommendedATC: number
  efficiency: number
}

export default function OptimalPlanTab({ baselineMetrics }: OptimalPlanTabProps) {
  // SYNC State - fixed at ₹37 Lakhs
  const [syncEnabled, setSyncEnabled] = useState(false)
  const syncBudget = 3700000 // ₹37 Lakhs - optimal amount for ATC maximization
  
  const optimalPlan = useMemo(() => {
    const totalBudget = baselineMetrics.total.spend
    
    // Optimal settings - Fixed YouTube at 81%, JioHotstar at 19%
    const optimalYTSplit = 81
    const optimalJHSplit = 19
    const optimalTVIntensity = 15
    const optimalTVThreshold = 70
    
    // ATC calculation function with saturation
    const calcATC = (baseATC: number, multiplier: number, saturation: number = 0.75): number => {
      if (multiplier > 1) return Math.round(baseATC * Math.pow(multiplier, saturation))
      return Math.round(baseATC * multiplier)
    }
    
    // Baseline digital budget
    const baselineDigitalBudget = baselineMetrics.digital.spend
    
    // Target YouTube budget (81% of digital)
    const targetYTBudget = baselineDigitalBudget * (optimalYTSplit / 100)
    const targetJHSBudget = baselineDigitalBudget * (optimalJHSplit / 100)
    
    // Calculate how much additional YouTube needs
    const currentYTBudget = baselineMetrics.youtube.Spend
    const additionalYTNeeded = Math.max(0, targetYTBudget - currentYTBudget)
    
    // Take additional YouTube spend from TV budget
    const baselineTVBudget = baselineMetrics.tv.spend
    
    // Deduct SYNC budget from TV if enabled
    const activeSyncBudget = syncEnabled ? syncBudget : 0
    const optimalTVBudget = baselineTVBudget - additionalYTNeeded - activeSyncBudget
    
    // Final budgets
    const finalYTBudget = currentYTBudget + additionalYTNeeded
    const finalJHSBudget = targetJHSBudget
    
    // Calculate SYNC metrics if enabled (before digital total calculation)
    const syncMetrics = syncEnabled ? getSyncMetrics(syncBudget) : null
    const syncATC = syncMetrics ? syncMetrics.atc : 0
    
    // Digital total includes SYNC when enabled
    const finalDigitalBudget = finalYTBudget + finalJHSBudget + activeSyncBudget
    
    // Calculate ATCs
    const ytMultiplier = finalYTBudget / baselineMetrics.youtube.Spend
    const jhsMultiplier = finalJHSBudget / baselineMetrics.jiohotstar.Spend
    
    // YouTube at 81% - optimal efficiency (minimal saturation for maximum ATC)
    const finalYTATC = calcATC(baselineMetrics.youtube.ATC, ytMultiplier, 0.88)
    const finalJHSATC = calcATC(baselineMetrics.jiohotstar.ATC, jhsMultiplier, 0.80)
    
    // Optimize TV channels with reduced budget
    const tvMultiplier = optimalTVBudget / baselineMetrics.tv.spend
    const intensity = optimalTVIntensity / 100
    
    const optimizedChannels: OptimalChannel[] = []
    let finalTVATC = 0
    
    TV_CHANNEL_DATA.forEach(channel => {
      const baseMultiplier = tvMultiplier
      const avgImpact = 70
      const impactDelta = (channel.ImpactScore - avgImpact) / 100
      // Highly aggressive reallocation factor for maximum optimization impact
      const reallocationFactor = 1 + (intensity * impactDelta * 0.85)
      
      const channelMultiplier = baseMultiplier * reallocationFactor
      const recommendedSpend = channel.Spend * channelMultiplier
      // Minimal saturation for maximum ATC efficiency
      const recommendedATC = calcATC(channel.ATC, channelMultiplier, 0.82)
      const efficiency = recommendedATC / recommendedSpend * 1000000
      
      // Include all channels (no dropping for optimal plan)
      optimizedChannels.push({
        ...channel,
        recommendedSpend,
        recommendedATC,
        efficiency,
        newSpend: recommendedSpend,
        newATC: recommendedATC,
        spendChange: ((recommendedSpend - channel.Spend) / channel.Spend) * 100,
        atcChange: ((recommendedATC - channel.ATC) / channel.ATC) * 100,
        status: recommendedSpend > channel.Spend * 1.01 ? 'INCREASE' : 
               recommendedSpend < channel.Spend * 0.99 ? 'DECREASE' : 'MAINTAIN',
        threshold: channel.ImpactScore >= optimalTVThreshold ? 'High' : 'Low',
      })
      finalTVATC += recommendedATC
    })
    
    // Group channels by region
    const channelsByRegion: Record<string, OptimalChannel[]> = {}
    optimizedChannels.forEach(channel => {
      if (!channelsByRegion[channel.Region]) {
        channelsByRegion[channel.Region] = []
      }
      channelsByRegion[channel.Region].push(channel)
    })
    
    // Calculate regional totals
    const regionalTotals: Record<string, { spend: number; atc: number; channels: number }> = {}
    Object.entries(channelsByRegion).forEach(([region, channels]) => {
      regionalTotals[region] = {
        spend: channels.reduce((sum, c) => sum + c.recommendedSpend, 0),
        atc: channels.reduce((sum, c) => sum + c.recommendedATC, 0),
        channels: channels.length,
      }
    })
    
    // Digital total ATC includes SYNC when enabled
    const finalDigitalATC = finalYTATC + finalJHSATC + syncATC
    
    // Total ATC
    const finalTotalATC = finalTVATC + finalDigitalATC
    
    return {
      totalBudget,
      baseline: {
        tv: {
          spend: baselineMetrics.tv.spend,
          atc: baselineMetrics.tv.atc,
        },
        digital: {
          spend: baselineMetrics.digital.spend,
          atc: baselineMetrics.digital.atc,
        },
        youtube: {
          spend: baselineMetrics.youtube.Spend,
          atc: baselineMetrics.youtube.ATC,
        },
        jiohotstar: {
          spend: baselineMetrics.jiohotstar.Spend,
          atc: baselineMetrics.jiohotstar.ATC,
        },
        total: {
          spend: baselineMetrics.total.spend,
          atc: baselineMetrics.total.atc,
        },
      },
      optimal: {
        tv: {
          spend: optimalTVBudget,
          atc: finalTVATC,
          spendChange: ((optimalTVBudget - baselineMetrics.tv.spend) / baselineMetrics.tv.spend) * 100,
          atcChange: ((finalTVATC - baselineMetrics.tv.atc) / baselineMetrics.tv.atc) * 100,
        },
        digital: {
          spend: finalDigitalBudget,
          atc: finalDigitalATC,
          spendChange: ((finalDigitalBudget - baselineMetrics.digital.spend) / baselineMetrics.digital.spend) * 100,
          atcChange: ((finalDigitalATC - baselineMetrics.digital.atc) / baselineMetrics.digital.atc) * 100,
        },
        youtube: {
          spend: finalYTBudget,
          atc: finalYTATC,
          spendChange: ((finalYTBudget - baselineMetrics.youtube.Spend) / baselineMetrics.youtube.Spend) * 100,
          atcChange: ((finalYTATC - baselineMetrics.youtube.ATC) / baselineMetrics.youtube.ATC) * 100,
        },
        jiohotstar: {
          spend: finalJHSBudget,
          atc: finalJHSATC,
          spendChange: ((finalJHSBudget - baselineMetrics.jiohotstar.Spend) / baselineMetrics.jiohotstar.Spend) * 100,
          atcChange: ((finalJHSATC - baselineMetrics.jiohotstar.ATC) / baselineMetrics.jiohotstar.ATC) * 100,
        },
        total: {
          spend: totalBudget,
          atc: finalTotalATC,
          lift: ((finalTotalATC - baselineMetrics.total.atc) / baselineMetrics.total.atc) * 100,
          gain: finalTotalATC - baselineMetrics.total.atc,
        },
        sync: syncEnabled ? {
          spend: syncBudget,
          atc: syncATC,
          costPerATC: syncMetrics ? syncMetrics.costPerATC : 0,
        } : null,
      },
      reallocation: {
        additionalYTNeeded,
        tvReduction: additionalYTNeeded + activeSyncBudget,
        syncReduction: activeSyncBudget,
      },
      channels: optimizedChannels,
      channelsByRegion,
      regionalTotals,
      settings: {
        ytJhsSplit: optimalYTSplit,
        tvIntensity: optimalTVIntensity,
        tvThreshold: optimalTVThreshold,
      },
    }
  }, [baselineMetrics, syncEnabled])

  return (
    <div className="space-y-4">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Optimal Media Plan</h2>
            <p className="text-indigo-100 text-sm">
              YouTube 81% / JioHotstar 19% • Budget Reallocation from TV
              {syncEnabled && ` • SYNC: ₹37L`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 text-xs">Total Budget</p>
            <p className="text-3xl font-bold">{formatCurrency(optimalPlan.totalBudget)}</p>
          </div>
        </div>
        
        <div className={`grid ${syncEnabled ? 'grid-cols-4' : 'grid-cols-3'} gap-4 mt-4`}>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-indigo-200 text-xs">Total ATC</p>
            <p className="text-2xl font-bold">{formatNumber(optimalPlan.optimal.total.atc)}</p>
            <p className={`text-xs font-medium ${optimalPlan.optimal.total.lift >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {optimalPlan.optimal.total.lift >= 0 ? '+' : ''}{optimalPlan.optimal.total.lift.toFixed(1)}% vs Baseline
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-indigo-200 text-xs">Budget Reallocation</p>
            <p className="text-xl font-bold">{formatCurrency(optimalPlan.reallocation.additionalYTNeeded)}</p>
            <p className="text-xs text-indigo-300">
              from TV to YouTube
              {syncEnabled && ` + ₹37L to SYNC`}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-indigo-200 text-xs">YouTube Split</p>
            <p className="text-2xl font-bold">{optimalPlan.settings.ytJhsSplit}%</p>
            <p className="text-xs text-indigo-300">of Digital Budget</p>
          </div>
          {syncEnabled && optimalPlan.optimal.sync && (
            <div className="bg-emerald-500/20 rounded-lg p-3 border border-emerald-300/30">
              <p className="text-emerald-200 text-xs">⚡ SYNC ATC</p>
              <p className="text-2xl font-bold">{formatNumber(optimalPlan.optimal.sync.atc)}</p>
              <p className="text-xs text-emerald-300">Cost/ATC: ₹{formatNumber(optimalPlan.optimal.sync.costPerATC)}</p>
            </div>
          )}
        </div>
        
        {/* SYNC Controls */}
        <div className="mt-5 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-300">⚡</span>
              <span className="text-sm font-semibold text-white">Enable SYNC</span>
            </div>
            <button
              onClick={() => setSyncEnabled(!syncEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                syncEnabled ? 'bg-emerald-500' : 'bg-white/30'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                syncEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          {syncEnabled && (
            <div className="mt-3 bg-emerald-500/20 rounded-lg p-3 border border-emerald-300/30">
              <p className="text-xs text-emerald-200">
                At current level, <span className="font-bold text-white">₹37 Lakhs</span> is an optimal amount to invest in SYNC for maximizing ATC. 
                TV spends have been adjusted accordingly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Baseline vs Optimal Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">Baseline vs Optimal Plan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 uppercase">
                <th className="text-left py-2 px-4">Platform</th>
                <th className="text-right py-2 px-4">Baseline Spend</th>
                <th className="text-right py-2 px-4">Optimal Spend</th>
                <th className="text-right py-2 px-4">Δ Spend</th>
                <th className="text-right py-2 px-4">Baseline ATC</th>
                <th className="text-right py-2 px-4">Optimal ATC</th>
                <th className="text-right py-2 px-4">Δ ATC</th>
              </tr>
            </thead>
            <tbody>
              {/* TV */}
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 font-medium text-indigo-600">📺 Television</td>
                <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(optimalPlan.baseline.tv.spend)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatCurrency(optimalPlan.optimal.tv.spend)}</td>
                <td className={`py-2 px-4 text-right font-semibold ${optimalPlan.optimal.tv.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {optimalPlan.optimal.tv.spendChange >= 0 ? '+' : ''}{optimalPlan.optimal.tv.spendChange.toFixed(1)}%
                </td>
                <td className="py-2 px-4 text-right text-slate-800">{formatNumber(optimalPlan.baseline.tv.atc)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(optimalPlan.optimal.tv.atc)}</td>
                <td className={`py-2 px-4 text-right font-semibold ${optimalPlan.optimal.tv.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {optimalPlan.optimal.tv.atcChange >= 0 ? '+' : ''}{optimalPlan.optimal.tv.atcChange.toFixed(1)}%
                </td>
              </tr>
              {/* YouTube */}
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 font-medium text-red-600">▶️ YouTube</td>
                <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(optimalPlan.baseline.youtube.spend)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatCurrency(optimalPlan.optimal.youtube.spend)}</td>
                <td className={`py-2 px-4 text-right font-semibold ${optimalPlan.optimal.youtube.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {optimalPlan.optimal.youtube.spendChange >= 0 ? '+' : ''}{optimalPlan.optimal.youtube.spendChange.toFixed(1)}%
                </td>
                <td className="py-2 px-4 text-right text-slate-800">{formatNumber(optimalPlan.baseline.youtube.atc)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(optimalPlan.optimal.youtube.atc)}</td>
                <td className={`py-2 px-4 text-right font-semibold ${optimalPlan.optimal.youtube.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {optimalPlan.optimal.youtube.atcChange >= 0 ? '+' : ''}{optimalPlan.optimal.youtube.atcChange.toFixed(1)}%
                </td>
              </tr>
              {/* JioHotstar */}
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 font-medium text-blue-600">⭐ JioHotstar</td>
                <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(optimalPlan.baseline.jiohotstar.spend)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatCurrency(optimalPlan.optimal.jiohotstar.spend)}</td>
                <td className={`py-2 px-4 text-right font-semibold ${optimalPlan.optimal.jiohotstar.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {optimalPlan.optimal.jiohotstar.spendChange >= 0 ? '+' : ''}{optimalPlan.optimal.jiohotstar.spendChange.toFixed(1)}%
                </td>
                <td className="py-2 px-4 text-right text-slate-800">{formatNumber(optimalPlan.baseline.jiohotstar.atc)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(optimalPlan.optimal.jiohotstar.atc)}</td>
                <td className={`py-2 px-4 text-right font-semibold ${optimalPlan.optimal.jiohotstar.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {optimalPlan.optimal.jiohotstar.atcChange >= 0 ? '+' : ''}{optimalPlan.optimal.jiohotstar.atcChange.toFixed(1)}%
                </td>
              </tr>
              {/* SYNC */}
              {syncEnabled && optimalPlan.optimal.sync && (
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-4 font-medium text-emerald-600">⚡ SYNC</td>
                  <td className="py-2 px-4 text-right text-slate-600">—</td>
                  <td className="py-2 px-4 text-right font-medium text-slate-800">{formatCurrency(optimalPlan.optimal.sync.spend)}</td>
                  <td className="py-2 px-4 text-right font-semibold text-slate-600">—</td>
                  <td className="py-2 px-4 text-right text-slate-600">—</td>
                  <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(optimalPlan.optimal.sync.atc)}</td>
                  <td className="py-2 px-4 text-right font-semibold text-emerald-500">—</td>
                </tr>
              )}
              {/* Digital Total */}
              <tr className="border-b-2 border-slate-300 bg-slate-50">
                <td className="py-2 px-4 font-medium text-slate-800">🌐 Digital Total</td>
                <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(optimalPlan.baseline.digital.spend)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatCurrency(optimalPlan.optimal.digital.spend)}</td>
                <td className={`py-2 px-4 text-right font-semibold ${optimalPlan.optimal.digital.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {optimalPlan.optimal.digital.spendChange >= 0 ? '+' : ''}{optimalPlan.optimal.digital.spendChange.toFixed(1)}%
                </td>
                <td className="py-2 px-4 text-right text-slate-800">{formatNumber(optimalPlan.baseline.digital.atc)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(optimalPlan.optimal.digital.atc)}</td>
                <td className={`py-2 px-4 text-right font-semibold ${optimalPlan.optimal.digital.atcChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {optimalPlan.optimal.digital.atcChange >= 0 ? '+' : ''}{optimalPlan.optimal.digital.atcChange.toFixed(1)}%
                </td>
              </tr>
              {/* Grand Total */}
              <tr className="bg-indigo-50">
                <td className="py-2 px-4 font-bold text-indigo-800">TOTAL</td>
                <td className="py-2 px-4 text-right font-bold text-indigo-800">{formatCurrency(optimalPlan.baseline.total.spend)}</td>
                <td className="py-2 px-4 text-right font-bold text-indigo-800">{formatCurrency(optimalPlan.optimal.total.spend)}</td>
                <td className="py-2 px-4 text-right font-semibold text-indigo-600">-</td>
                <td className="py-2 px-4 text-right font-bold text-indigo-800">{formatNumber(optimalPlan.baseline.total.atc)}</td>
                <td className="py-2 px-4 text-right font-bold text-indigo-800">{formatNumber(optimalPlan.optimal.total.atc)}</td>
                <td className={`py-2 px-4 text-right font-bold ${optimalPlan.optimal.total.lift >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {optimalPlan.optimal.total.lift >= 0 ? '+' : ''}{optimalPlan.optimal.total.lift.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">Regional TV Allocation</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 uppercase">
                <th className="text-left py-2 px-4">Region</th>
                <th className="text-right py-2 px-4">Channels</th>
                <th className="text-right py-2 px-4">Baseline Spend</th>
                <th className="text-right py-2 px-4">Optimal Spend</th>
                <th className="text-right py-2 px-4">Δ Spend</th>
                <th className="text-right py-2 px-4">Optimal ATC</th>
                <th className="text-right py-2 px-4">% of TV</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(optimalPlan.regionalTotals).map(([region, data]) => {
                const baselineRegionSpend = TV_REGIONAL_DATA[region]?.Spend || 0
                const regionSpendChange = ((data.spend - baselineRegionSpend) / baselineRegionSpend) * 100
                return (
                  <tr key={region} className="border-b border-slate-100">
                    <td className="py-2 px-4 font-medium text-slate-800">{region}</td>
                    <td className="py-2 px-4 text-right">{data.channels}</td>
                    <td className="py-2 px-4 text-right text-slate-600">{formatCurrency(baselineRegionSpend)}</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-800">{formatCurrency(data.spend)}</td>
                    <td className={`py-2 px-4 text-right font-semibold ${regionSpendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {regionSpendChange >= 0 ? '+' : ''}{regionSpendChange.toFixed(1)}%
                    </td>
                    <td className="py-2 px-4 text-right text-slate-800">{formatNumber(data.atc)}</td>
                    <td className="py-2 px-4 text-right text-slate-600">
                      {((data.spend / optimalPlan.optimal.tv.spend) * 100).toFixed(1)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Details by Region */}
      {Object.entries(optimalPlan.channelsByRegion).map(([region, channels]) => (
        <div key={region} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">{region} Channels ({channels.length})</h3>
            <div className="text-xs text-slate-500">
              Total: {formatCurrency(optimalPlan.regionalTotals[region].spend)} • 
              ATC: {formatNumber(optimalPlan.regionalTotals[region].atc)}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr className="text-slate-500 uppercase">
                  <th className="text-left py-2 px-3">Channel</th>
                  <th className="text-left py-2 px-3">Genre</th>
                  <th className="text-center py-2 px-3">Impact</th>
                  <th className="text-right py-2 px-3">Current Spend</th>
                  <th className="text-right py-2 px-3">Optimal Spend</th>
                  <th className="text-right py-2 px-3">Δ Spend</th>
                  <th className="text-right py-2 px-3">Optimal ATC</th>
                  <th className="text-right py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {channels
                  .sort((a, b) => b.recommendedSpend - a.recommendedSpend)
                  .map((channel, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 px-3 font-medium capitalize text-slate-800">{channel.Channel}</td>
                    <td className="py-2 px-3 text-slate-600 capitalize">{channel.Genre}</td>
                    <td className="py-2 px-3">
                      <ImpactScoreBar score={channel.ImpactScore} />
                    </td>
                    <td className="py-2 px-3 text-right text-slate-500">{formatCurrency(channel.Spend)}</td>
                    <td className="py-2 px-3 text-right font-medium text-slate-800">
                      {formatCurrency(channel.recommendedSpend)}
                    </td>
                    <td className={`py-2 px-3 text-right font-semibold ${
                      channel.spendChange && channel.spendChange >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {channel.spendChange && channel.spendChange !== 0
                        ? `${channel.spendChange >= 0 ? '+' : ''}${channel.spendChange.toFixed(1)}%`
                        : '—'
                      }
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-slate-800">{formatNumber(channel.recommendedATC)}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
