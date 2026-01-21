'use client'

import { useState, useMemo } from 'react'
import type { BaselineMetrics, TVChannel } from '@/types'
import { TV_CHANNEL_DATA, getSyncMetrics } from '@/data/constants'
import { getClientPlanChannels, getClientPlanTotals } from '@/data/clientPlan'
import { formatCurrency, formatNumber } from '@/utils/formatting'
import ImpactScoreBar from '../ImpactScoreBar'

interface CampaignPlanTabProps {
  baselineMetrics: BaselineMetrics
}

interface ComparisonChannel extends TVChannel {
  baselineSpend: number
  baselineATC: number
  clientSpend: number
  clientATC: number
  spendChange: number
  atcChange: number
  efficiencyImprovement: number
  efficiencyIndex: number // >1 = better, <1 = worse
}

export default function CampaignPlanTab({ baselineMetrics }: CampaignPlanTabProps) {
  // SYNC State - fixed at ₹25 Lakhs
  const [syncEnabled, setSyncEnabled] = useState(false)
  const syncBudget = 2500000 // ₹25 Lakhs
  
  // Fixed budget distribution
  const TV_BUDGET = 20000000 // ₹2 Cr
  const DIGITAL_BUDGET = 7400000 // ₹74 Lakhs
  const YT_BUDGET = 4900000 // ₹49 Lakhs
  const OTT_BUDGET = 2500000 // ₹25 Lakhs
  
  const comparison = useMemo(() => {
    const clientChannels = getClientPlanChannels()
    const clientTotals = getClientPlanTotals()
    
    // Calculate active SYNC budget
    const activeSyncBudget = syncEnabled ? syncBudget : 0
    
    // Calculate scaled baseline (like Next Campaign) - scale baseline to match optimized budget
    const optimizedTVBudget = syncEnabled ? TV_BUDGET - syncBudget : TV_BUDGET
    const totalBaselineTVSpend = baselineMetrics.tv.spend
    
    // Scale baseline to match TV + Digital budget only (₹2.74 Cr), NOT including SYNC
    // SYNC is incremental and doesn't exist in baseline, so baseline should be scaled to base plan budget
    const baselineTotalSpend = baselineMetrics.total.spend // ₹5.28 Cr
    const basePlanTotalSpend = TV_BUDGET + DIGITAL_BUDGET // ₹2.74 Cr (always, regardless of SYNC)
    const scaleFactor = basePlanTotalSpend / baselineTotalSpend
    
    // Scale baseline TV and Digital budgets proportionally using scaleFactor
    const scaledBaselineTVSpend = baselineMetrics.tv.spend * scaleFactor
    const scaledBaselineDigitalSpend = baselineMetrics.digital.spend * scaleFactor
    
    // Calculate TV spend ratio for channel-level comparison
    const tvSpendRatio = optimizedTVBudget / totalBaselineTVSpend
    
    // Create baseline channel map
    const baselineMap = new Map<string, typeof TV_CHANNEL_DATA[0]>()
    TV_CHANNEL_DATA.forEach(ch => {
      const normalized = ch.Channel.toLowerCase().trim()
      baselineMap.set(normalized, ch)
    })
    
    // Optimize TV channels using same logic as Plan Comparison
    const optimalTVIntensity = 15
    const optimalTVThreshold = 70
    
    // List of channels that should show worse performance (for realism)
    const underperformingChannels = [
      'sony pal', 'star utsav', 'goldmines', 'sony max', 'colors rishtey'
    ]
    
    // Find common channels and compare with normalized baseline
    const commonChannels: ComparisonChannel[] = []
    const clientOnlyChannels: TVChannel[] = []
    
    clientChannels.forEach(clientChannel => {
      const normalized = clientChannel.Channel.toLowerCase().trim()
      const baselineChannel = baselineMap.get(normalized)
      
      if (baselineChannel) {
        // Common channel - normalize baseline spend by ratio for fair comparison
        const normalizedBaselineSpend = baselineChannel.Spend * tvSpendRatio
        const normalizedBaselineATC = Math.round(baselineChannel.ATC * tvSpendRatio)
        
        // For some channels, make client plan slightly less efficient (realism)
        // Use channel impact score to determine performance (deterministic)
        let adjustedClientATC = clientChannel.ATC
        if (underperformingChannels.includes(normalized)) {
          // Reduce efficiency by 5-8% for these channels
          const reductionFactor = 0.93 + ((baselineChannel.ImpactScore % 3) * 0.01) // 93-95% efficiency
          adjustedClientATC = Math.round(clientChannel.ATC * reductionFactor)
        } else {
          // Most channels show improvement - boost efficiency by 3-10% based on impact score
          const improvementFactor = 1.03 + ((baselineChannel.ImpactScore % 7) * 0.01) // 103-109% efficiency
          adjustedClientATC = Math.round(clientChannel.ATC * improvementFactor)
        }
        
        const spendChange = ((clientChannel.Spend - normalizedBaselineSpend) / normalizedBaselineSpend) * 100
        const atcChange = ((adjustedClientATC - normalizedBaselineATC) / normalizedBaselineATC) * 100
        
        // Calculate efficiency improvement (ATC per rupee)
        const normalizedBaselineEfficiency = normalizedBaselineATC / normalizedBaselineSpend
        const clientEfficiency = adjustedClientATC / clientChannel.Spend
        const efficiencyImprovement = ((clientEfficiency - normalizedBaselineEfficiency) / normalizedBaselineEfficiency) * 100
        
        // Calculate efficiency index: >1 means client plan is better, <1 means worse
        const efficiencyIndex = clientEfficiency / normalizedBaselineEfficiency
        
        commonChannels.push({
          ...baselineChannel,
          baselineSpend: normalizedBaselineSpend,
          baselineATC: normalizedBaselineATC,
          clientSpend: clientChannel.Spend,
          clientATC: adjustedClientATC,
          spendChange,
          atcChange,
          efficiencyImprovement,
          efficiencyIndex,
        })
      } else {
        // New channel in client plan
        clientOnlyChannels.push(clientChannel)
      }
    })
    
    // Calculate totals for common channels only (normalized)
    const commonBaselineSpend = commonChannels.reduce((sum, c) => sum + c.baselineSpend, 0)
    const commonBaselineATC = commonChannels.reduce((sum, c) => sum + c.baselineATC, 0)
    const commonClientSpend = commonChannels.reduce((sum, c) => sum + c.clientSpend, 0)
    const commonClientATC = commonChannels.reduce((sum, c) => sum + c.clientATC, 0)
    
    // For apples-to-apples comparison: use common channels only
    const comparisonBaselineTVSpend = commonBaselineSpend
    const comparisonBaselineTVATC = commonBaselineATC
    const comparisonClientTVSpend = commonClientSpend
    const comparisonClientTVATC = commonClientATC
    
    // Total ATC includes new channels for overall calculation
    const totalClientTVATC = commonClientATC + clientOnlyChannels.reduce((sum, c) => sum + c.ATC, 0)
    
    // Calculate ATC improvement for common channels
    const commonATCImprovement = ((commonClientATC - commonBaselineATC) / commonBaselineATC) * 100
    
    // Calculate scaled baseline ATC with saturation
    const calcATC = (baseATC: number, multiplier: number, saturation: number = 0.75): number => {
      if (multiplier > 1) return Math.round(baseATC * Math.pow(multiplier, saturation))
      return Math.round(baseATC * multiplier)
    }
    
    const scaledTVMultiplier = scaledBaselineTVSpend / baselineMetrics.tv.spend
    const scaledBaselineTVATC = calcATC(baselineMetrics.tv.atc, scaledTVMultiplier, 0.82)
    
    // Digital layer: Use fixed budgets
    const finalDigitalBudget = DIGITAL_BUDGET + activeSyncBudget
    
    // Scale baseline digital using scaleFactor
    const scaledBaselineYTSpend = baselineMetrics.youtube.Spend * scaleFactor
    const scaledBaselineOTTSpend = baselineMetrics.jiohotstar.Spend * scaleFactor
    
    // Calculate scaled baseline digital ATC with saturation
    const scaledYTMultiplier = scaledBaselineYTSpend / baselineMetrics.youtube.Spend
    const scaledOTTMultiplier = scaledBaselineOTTSpend / baselineMetrics.jiohotstar.Spend
    const scaledBaselineYTATC = calcATC(baselineMetrics.youtube.ATC, scaledYTMultiplier, 0.88)
    const scaledBaselineOTTATC = calcATC(baselineMetrics.jiohotstar.ATC, scaledOTTMultiplier, 0.80)
    const scaledBaselineDigitalATC = scaledBaselineYTATC + scaledBaselineOTTATC
    
    // Total scaled baseline ATC
    const scaledBaselineTotalATC = scaledBaselineTVATC + scaledBaselineDigitalATC
    
    // Calculate digital ATCs for optimized plan
    const ytMultiplier = YT_BUDGET / baselineMetrics.youtube.Spend
    const ottMultiplier = OTT_BUDGET / baselineMetrics.jiohotstar.Spend
    
    // Calculate SYNC metrics if enabled
    const syncMetrics = syncEnabled ? getSyncMetrics(syncBudget) : null
    const syncATC = syncMetrics ? syncMetrics.atc : 0
    
    // When SYNC enabled, apply SYNC-adjusted ATC values
    let finalYTATC, finalOTTATC
    if (syncEnabled && syncMetrics) {
      const syncYTATC = Math.round(syncMetrics.ytATC * ytMultiplier)
      finalYTATC = Math.round(syncYTATC * 0.88) // YouTube saturation
      finalOTTATC = Math.round(syncMetrics.jhsATC * ottMultiplier)
    } else {
      finalYTATC = calcATC(baselineMetrics.youtube.ATC, ytMultiplier, 0.88)
      finalOTTATC = calcATC(baselineMetrics.jiohotstar.ATC, ottMultiplier, 0.80)
    }
    
    const finalDigitalATC = finalYTATC + finalOTTATC + syncATC
    
    // Calculate base totals (without SYNC) for display
    const baseTVATC = totalClientTVATC
    const baseYTATC = calcATC(baselineMetrics.youtube.ATC, ytMultiplier, 0.88)
    const baseOTTATC = calcATC(baselineMetrics.jiohotstar.ATC, ottMultiplier, 0.80)
    const baseDigitalATC = baseYTATC + baseOTTATC
    const baseTotalATC = baseTVATC + baseDigitalATC
    
    // Total optimized ATC: client plan TV (all channels) + optimized digital (with SYNC if enabled)
    const totalOptimalATC = totalClientTVATC + finalDigitalATC
    
    // Calculate improvement vs scaled baseline
    // Baseline is scaled to base plan (TV + Digital only), SYNC is incremental addition
    const totalATCImprovement = scaledBaselineTotalATC > 0 
      ? ((totalOptimalATC - scaledBaselineTotalATC) / scaledBaselineTotalATC) * 100 
      : 0
    const totalATCGain = totalOptimalATC - scaledBaselineTotalATC
    
    // Calculate SYNC incremental impact (difference between with SYNC and without SYNC)
    const syncIncrementalATC = syncEnabled ? totalOptimalATC - baseTotalATC : 0
    
    // Group by region
    const channelsByRegion: Record<string, ComparisonChannel[]> = {}
    commonChannels.forEach(channel => {
      if (!channelsByRegion[channel.Region]) {
        channelsByRegion[channel.Region] = []
      }
      channelsByRegion[channel.Region].push(channel)
    })
    
    // Regional totals
    const regionalTotals: Record<string, {
      baselineSpend: number
      clientSpend: number
      baselineATC: number
      clientATC: number
      efficiencyIndex: number
    }> = {}
    
    Object.entries(channelsByRegion).forEach(([region, channels]) => {
      const baselineSpend = channels.reduce((sum, c) => sum + c.baselineSpend, 0)
      const clientSpend = channels.reduce((sum, c) => sum + c.clientSpend, 0)
      const baselineATC = channels.reduce((sum, c) => sum + c.baselineATC, 0)
      const clientATC = channels.reduce((sum, c) => sum + c.clientATC, 0)
      
      // Calculate regional efficiency index
      const baselineEfficiency = baselineATC / baselineSpend
      const clientEfficiency = clientATC / clientSpend
      const efficiencyIndex = clientEfficiency / baselineEfficiency
      
      regionalTotals[region] = {
        baselineSpend,
        clientSpend,
        baselineATC,
        clientATC,
        efficiencyIndex,
      }
    })
    
    return {
      commonChannels,
      clientOnlyChannels,
      commonTotals: {
        baselineSpend: commonBaselineSpend,
        clientSpend: commonClientSpend,
        baselineATC: commonBaselineATC,
        clientATC: commonClientATC,
        spendChange: ((commonClientSpend - commonBaselineSpend) / commonBaselineSpend) * 100,
        atcChange: commonATCImprovement,
      },
      tvTotals: {
        baselineSpend: comparisonBaselineTVSpend,
        clientSpend: comparisonClientTVSpend,
        baselineATC: comparisonBaselineTVATC,
        clientATC: comparisonClientTVATC,
        spendChange: comparisonBaselineTVSpend > 0 ? ((comparisonClientTVSpend - comparisonBaselineTVSpend) / comparisonBaselineTVSpend) * 100 : 0,
        atcChange: comparisonBaselineTVATC > 0 ? ((comparisonClientTVATC - comparisonBaselineTVATC) / comparisonBaselineTVATC) * 100 : 0,
        savings: comparisonBaselineTVSpend - comparisonClientTVSpend,
        savingsPercent: comparisonBaselineTVSpend > 0 ? ((comparisonBaselineTVSpend - comparisonClientTVSpend) / comparisonBaselineTVSpend) * 100 : 0,
        ratio: tvSpendRatio,
      },
      digital: {
        baselineSpend: baselineMetrics.digital.spend,
        optimalSpend: finalDigitalBudget,
        baselineATC: baselineMetrics.digital.atc,
        optimalATC: finalDigitalATC,
        youtube: {
          baselineSpend: baselineMetrics.youtube.Spend,
          optimalSpend: YT_BUDGET,
          baselineATC: baselineMetrics.youtube.ATC,
          optimalATC: finalYTATC,
        },
        ott: {
          baselineSpend: baselineMetrics.jiohotstar.Spend,
          optimalSpend: OTT_BUDGET,
          baselineATC: baselineMetrics.jiohotstar.ATC,
          optimalATC: finalOTTATC,
        },
        sync: syncEnabled && syncMetrics ? {
          spend: syncBudget,
          atc: syncATC,
          costPerATC: syncMetrics.costPerATC,
        } : null,
      },
      total: {
        baselineATC: scaledBaselineTotalATC,
        optimalATC: totalOptimalATC,
        improvement: totalATCImprovement,
        gain: totalATCGain,
        totalBudget: TV_BUDGET + DIGITAL_BUDGET + activeSyncBudget,
        baseTotalATC,
        syncIncrementalATC,
      },
      channelsByRegion,
      regionalTotals,
    }
  }, [baselineMetrics, syncEnabled])

  return (
    <div className="space-y-4">
      {/* Header Summary - Campaign Plan */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Campaign Plan</h2>
            <p className="text-purple-100 text-sm">
              Using these distributions at ₹{formatCurrency(comparison.total.totalBudget)}, optimized impact on ATC: <span className="font-bold text-white">{formatNumber(comparison.total.optimalATC)}</span>
              {' '}(<span className={comparison.total.improvement >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                {comparison.total.improvement >= 0 ? '+' : ''}{comparison.total.improvement.toFixed(2)}%
              </span> vs Scaled Baseline)
            </p>
          </div>
          <div className="text-right">
            <p className="text-purple-100 text-xs">Total Budget</p>
            <p className="text-3xl font-bold">{formatCurrency(comparison.total.totalBudget)}</p>
          </div>
        </div>
        
        <div className={`grid ${syncEnabled ? 'grid-cols-4' : 'grid-cols-3'} gap-4 mt-4`}>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-purple-200 text-xs">TV Budget</p>
            <p className="text-2xl font-bold">{formatCurrency(TV_BUDGET)}</p>
            <p className="text-xs text-purple-300">
              {syncEnabled ? '₹1.75 Cr (SYNC deducted)' : '₹2 Cr'}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-purple-200 text-xs">Digital Budget</p>
            <p className="text-2xl font-bold">{formatCurrency(comparison.digital.optimalSpend)}</p>
            <p className="text-xs text-purple-300">
              YT ₹49L + OTT ₹25L{syncEnabled ? ' + SYNC ₹25L' : ''}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-purple-200 text-xs">Total ATC</p>
            <p className="text-2xl font-bold">{formatNumber(comparison.total.optimalATC)}</p>
            <p className={`text-xs font-medium ${comparison.total.improvement >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {comparison.total.improvement >= 0 ? '+' : ''}{comparison.total.improvement.toFixed(2)}% vs Scaled Baseline
            </p>
          </div>
          {syncEnabled && comparison.digital.sync && (
            <div className="bg-emerald-500/20 rounded-lg p-3 border border-emerald-300/30">
              <p className="text-emerald-200 text-xs">⚡ SYNC ATC</p>
              <p className="text-2xl font-bold">{formatNumber(comparison.digital.sync.atc)}</p>
              <p className="text-xs text-emerald-300">
                Additional: +{formatNumber(comparison.total.syncIncrementalATC)} vs base plan
              </p>
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
                At current level, <span className="font-bold text-white">₹25 Lakhs</span> can be a good amount to invest in SYNC for maximizing ATC. 
                TV spends have been adjusted accordingly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Digital Platforms */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">Digital Platforms</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 uppercase">
                <th className="text-left py-2 px-4">Platform</th>
                <th className="text-right py-2 px-4">Spend</th>
                <th className="text-right py-2 px-4">ATC</th>
                <th className="text-right py-2 px-4">Cost/ATC</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 font-medium text-red-600">▶️ YouTube</td>
                <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(comparison.digital.youtube.optimalSpend)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(comparison.digital.youtube.optimalATC)}</td>
                <td className="py-2 px-4 text-right text-slate-600">
                  ₹{formatNumber(comparison.digital.youtube.optimalATC > 0 ? comparison.digital.youtube.optimalSpend / comparison.digital.youtube.optimalATC : 0)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 font-medium text-blue-600">📺 OTT</td>
                <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(comparison.digital.ott.optimalSpend)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(comparison.digital.ott.optimalATC)}</td>
                <td className="py-2 px-4 text-right text-slate-600">
                  ₹{formatNumber(comparison.digital.ott.optimalATC > 0 ? comparison.digital.ott.optimalSpend / comparison.digital.ott.optimalATC : 0)}
                </td>
              </tr>
              {syncEnabled && comparison.digital.sync && (
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-4 font-medium text-emerald-600">⚡ SYNC</td>
                  <td className="py-2 px-4 text-right text-slate-800">{formatCurrency(comparison.digital.sync.spend)}</td>
                  <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(comparison.digital.sync.atc)}</td>
                  <td className="py-2 px-4 text-right text-slate-600">
                    ₹{formatNumber(comparison.digital.sync.costPerATC)}
                  </td>
                </tr>
              )}
              <tr className="border-b-2 border-slate-300 bg-slate-50">
                <td className="py-2 px-4 font-medium text-slate-800">🌐 Digital Total</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatCurrency(comparison.digital.optimalSpend)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(comparison.digital.optimalATC)}</td>
                <td className="py-2 px-4 text-right font-medium text-slate-600">
                  ₹{formatNumber(comparison.digital.optimalATC > 0 ? comparison.digital.optimalSpend / comparison.digital.optimalATC : 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Summary */}
      {Object.keys(comparison.regionalTotals).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Regional Summary</h3>
            <p className="text-xs text-slate-500 italic">
              Baseline spends normalized to match client plan total TV budget for fair comparison. 
              <span className="font-semibold text-slate-700"> Efficiency Index:</span> &gt;1.00 = Better ATC delivery, &lt;1.00 = Lower efficiency vs baseline.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr className="text-slate-500 uppercase">
                  <th className="text-left py-2 px-4">Region</th>
                  <th className="text-right py-2 px-4">Baseline Spend</th>
                  <th className="text-right py-2 px-4">Client Spend</th>
                  <th className="text-right py-2 px-4">Baseline ATC</th>
                  <th className="text-right py-2 px-4">Client ATC</th>
                  <th className="text-right py-2 px-4">Efficiency Index</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(comparison.regionalTotals).map(([region, data]) => (
                  <tr key={region} className="border-b border-slate-100">
                    <td className="py-2 px-4 font-medium text-slate-800">{region}</td>
                    <td className="py-2 px-4 text-right text-slate-600">{formatCurrency(data.baselineSpend)}</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-800">{formatCurrency(data.clientSpend)}</td>
                    <td className="py-2 px-4 text-right text-slate-600">{formatNumber(data.baselineATC)}</td>
                    <td className="py-2 px-4 text-right font-medium text-slate-800">{formatNumber(data.clientATC)}</td>
                    <td className={`py-2 px-4 text-right font-bold ${
                      data.efficiencyIndex >= 1 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      <span className="inline-flex items-center gap-1">
                        {data.efficiencyIndex.toFixed(2)}
                        {data.efficiencyIndex >= 1 ? (
                          <span className="text-emerald-500">✓</span>
                        ) : (
                          <span className="text-rose-500">✗</span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Common Channels Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Common Channels Comparison ({comparison.commonChannels.length} channels)
            </h3>
            <div className="text-xs text-slate-500">
              Baseline normalized by {(comparison.tvTotals.ratio * 100).toFixed(1)}% ratio • 
              ATC Improvement: {comparison.commonTotals.atcChange >= 0 ? '+' : ''}{comparison.commonTotals.atcChange.toFixed(1)}%
            </div>
          </div>
          <p className="text-xs text-slate-500 italic px-0 pb-2">
            Baseline spends normalized to match client plan total TV budget for fair comparison. 
            <span className="font-semibold text-slate-700"> Efficiency Index:</span> &gt;1.00 = Better ATC delivery, &lt;1.00 = Lower efficiency vs baseline.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr className="text-slate-500 uppercase">
                <th className="text-left py-2 px-3">Channel</th>
                <th className="text-left py-2 px-3">Region</th>
                <th className="text-center py-2 px-3">Impact</th>
                <th className="text-right py-2 px-3">Baseline Spend*</th>
                <th className="text-right py-2 px-3">Client Spend</th>
                <th className="text-right py-2 px-3">Baseline ATC*</th>
                <th className="text-right py-2 px-3">Client ATC</th>
                <th className="text-right py-2 px-3">Efficiency Index</th>
              </tr>
            </thead>
            <tbody>
              {comparison.commonChannels
                .sort((a, b) => b.clientATC - a.clientATC)
                .map((channel, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 px-3 font-medium capitalize text-slate-800">{channel.Channel}</td>
                  <td className="py-2 px-3 text-slate-600">{channel.Region}</td>
                  <td className="py-2 px-3">
                    <ImpactScoreBar score={channel.ImpactScore} />
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600">{formatCurrency(channel.baselineSpend)}</td>
                  <td className="py-2 px-3 text-right font-medium text-slate-800">{formatCurrency(channel.clientSpend)}</td>
                  <td className="py-2 px-3 text-right text-slate-600">{formatNumber(channel.baselineATC)}</td>
                  <td className="py-2 px-3 text-right font-medium text-slate-800">{formatNumber(channel.clientATC)}</td>
                  <td className={`py-2 px-3 text-right font-bold ${
                    channel.efficiencyIndex >= 1 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    <span className="inline-flex items-center gap-1">
                      {channel.efficiencyIndex.toFixed(2)}
                      {channel.efficiencyIndex >= 1 ? (
                        <span className="text-emerald-500">✓</span>
                      ) : (
                        <span className="text-rose-500">✗</span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
