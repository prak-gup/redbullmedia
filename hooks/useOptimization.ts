import { useMemo } from 'react'
import type { BaselineMetrics, OptimizedMetrics } from '@/types'
import { DIGITAL_DATA, TV_REGIONAL_DATA, TV_CHANNEL_DATA, getSyncMetrics } from '@/data/constants'

/**
 * Calculates baseline metrics from raw data
 */
export function useBaselineMetrics(): BaselineMetrics {
  return useMemo(() => {
    const tvSpend = Object.values(TV_REGIONAL_DATA).reduce((s, r) => s + r.Spend, 0)
    const tvATC = Object.values(TV_REGIONAL_DATA).reduce((s, r) => s + r.ATC, 0)
    const digitalSpend = DIGITAL_DATA.YouTube.Spend + DIGITAL_DATA.JioHotstar.Spend
    const digitalATC = DIGITAL_DATA.YouTube.ATC + DIGITAL_DATA.JioHotstar.ATC
    
    return {
      tv: { spend: tvSpend, atc: tvATC },
      digital: { spend: digitalSpend, atc: digitalATC },
      youtube: DIGITAL_DATA.YouTube,
      jiohotstar: DIGITAL_DATA.JioHotstar,
      total: { spend: tvSpend + digitalSpend, atc: tvATC + digitalATC },
      tvPct: (tvSpend / (tvSpend + digitalSpend)) * 100,
      digitalPct: (digitalSpend / (tvSpend + digitalSpend)) * 100,
      ytPct: (DIGITAL_DATA.YouTube.Spend / digitalSpend) * 100,
    }
  }, [])
}

/**
 * Calculates optimized metrics based on user inputs
 */
export function useOptimizedMetrics(
  hasOptimized: boolean,
  baselineMetrics: BaselineMetrics,
  tvDigitalSplit: number,
  ytJhsSplit: number,
  tvIntensity: number,
  tvThreshold: number,
  syncEnabled: boolean,
  syncBudget: number
): OptimizedMetrics | null {
  return useMemo(() => {
    if (!hasOptimized) return null
    
    const totalBudget = baselineMetrics.total.spend
    
    // SYNC budget comes from TV reduction
    const activeSyncBudget = syncEnabled ? syncBudget : 0
    const syncMetrics = getSyncMetrics(activeSyncBudget)
    
    // Adjust TV budget (reduced by SYNC amount)
    const newTVBudget = (totalBudget * (tvDigitalSplit / 100)) - activeSyncBudget
    const newDigitalBudget = totalBudget * ((100 - tvDigitalSplit) / 100)
    const newYTBudget = newDigitalBudget * (ytJhsSplit / 100)
    const newJHSBudget = newDigitalBudget * ((100 - ytJhsSplit) / 100)
    
    const calcATC = (baseATC: number, multiplier: number, saturation: number = 0.75): number => {
      if (multiplier > 1) return Math.round(baseATC * Math.pow(multiplier, saturation))
      return Math.round(baseATC * multiplier)
    }
    
    const ytMultiplier = newYTBudget / baselineMetrics.youtube.Spend
    const jhsMultiplier = newJHSBudget / baselineMetrics.jiohotstar.Spend
    
    // YouTube saturation: After 81% split, performance drops significantly
    // Calculate saturation factor based on how much above 81% we are
    const optimalYTSplit = 81
    let ytSaturationFactor = 1.0
    if (ytJhsSplit > optimalYTSplit) {
      // Diminishing returns: each % above 81% reduces efficiency by 5%
      const excessPercent = ytJhsSplit - optimalYTSplit
      ytSaturationFactor = 1 - (excessPercent * 0.05) // Max 19% reduction at 100%
      ytSaturationFactor = Math.max(0.3, ytSaturationFactor) // Minimum 30% efficiency
    }
    
    // When SYNC is enabled, use adjusted ATC values (SYNC captures some conversions)
    let newYTATC, newJHSATC
    if (syncEnabled) {
      // SYNC affects YT and JHS performance (overlap effect)
      // Apply YouTube saturation to SYNC-adjusted values too
      const baseYTATC = Math.round(syncMetrics.ytATC * ytMultiplier)
      newYTATC = Math.round(baseYTATC * ytSaturationFactor)
      newJHSATC = Math.round(syncMetrics.jhsATC * jhsMultiplier)
    } else {
      const baseYTATC = calcATC(baselineMetrics.youtube.ATC, ytMultiplier, 0.78)
      newYTATC = Math.round(baseYTATC * ytSaturationFactor)
      newJHSATC = calcATC(baselineMetrics.jiohotstar.ATC, jhsMultiplier, 0.72)
    }
    
    const newDigitalATC = newYTATC + newJHSATC + (syncEnabled ? syncMetrics.atc : 0)
    
    // TV Regional - CONSISTENT: Same % change for all regions as overall TV
    // Note: newTVBudget already has SYNC budget deducted
    const tvMultiplier = newTVBudget / baselineMetrics.tv.spend
    const intensity = tvIntensity / 100
    const optimizedRegions: Record<string, any> = {}
    let totalOptimizedTVATC = 0
    
    // All regions get the SAME percentage change as overall TV budget
    Object.entries(TV_REGIONAL_DATA).forEach(([region, data]) => {
      const newRegionSpend = data.Spend * tvMultiplier
      const newRegionATC = calcATC(data.ATC, tvMultiplier, 0.70)
      
      optimizedRegions[region] = {
        ...data,
        newSpend: newRegionSpend,
        newATC: newRegionATC,
        spendChange: ((newRegionSpend - data.Spend) / data.Spend) * 100,
        atcChange: ((newRegionATC - data.ATC) / data.ATC) * 100,
      }
      
      totalOptimizedTVATC += newRegionATC
    })
    
    // Channel optimization - CONSISTENT with regional change
    // All channels in a region get the base regional % change
    // Then intensity determines how much reallocation happens WITHIN the region
    const optimizedChannels = TV_CHANNEL_DATA.map(channel => {
      const regionOpt = optimizedRegions[channel.Region]
      if (!regionOpt) {
        return {
          ...channel,
          newSpend: channel.Spend,
          newATC: channel.ATC,
          status: 'MAINTAIN' as const,
          spendChange: 0,
          atcChange: 0,
        }
      }
      
      // Base multiplier = same as region (consistent!)
      const baseMultiplier = regionOpt.newSpend / TV_REGIONAL_DATA[channel.Region].Spend
      
      // Within-region reallocation based on intensity and impact score
      // High impact gets slight boost, low impact gets slight reduction
      // This is RELATIVE adjustment, the region total stays the same
      const avgImpact = 70 // baseline
      const impactDelta = (channel.ImpactScore - avgImpact) / 100
      const reallocationFactor = 1 + (intensity * impactDelta * 0.5) // max ±7.5% adjustment at 15% intensity
      
      const channelMultiplier = baseMultiplier * reallocationFactor
      const newSpend = channel.Spend * channelMultiplier
      const newATC = calcATC(channel.ATC, channelMultiplier, 0.72)
      const spendChange = ((newSpend - channel.Spend) / channel.Spend) * 100
      const atcChange = channel.ATC > 0 ? ((newATC - channel.ATC) / channel.ATC) * 100 : 0
      
      // STATUS IS DETERMINED BY ACTUAL SPEND CHANGE
      let status: 'INCREASE' | 'DECREASE' | 'MAINTAIN' = 'MAINTAIN'
      if (spendChange > 1) {
        status = 'INCREASE'
      } else if (spendChange < -1) {
        status = 'DECREASE'
      }
      
      // If MAINTAIN (change within ±1%), keep original values exactly
      if (status === 'MAINTAIN') {
        return {
          ...channel,
          newSpend: channel.Spend,
          newATC: channel.ATC,
          spendChange: 0,
          atcChange: 0,
          threshold: channel.ImpactScore >= 70 ? 'High' as const : 'Low' as const,
          status,
        }
      }
      
      return {
        ...channel,
        newSpend,
        newATC,
        spendChange,
        atcChange,
        threshold: channel.ImpactScore >= 70 ? 'High' as const : 'Low' as const,
        status,
      }
    })
    
    const newTotalATC = totalOptimizedTVATC + newDigitalATC
    
    return {
      tv: {
        spend: newTVBudget,
        atc: totalOptimizedTVATC,
        spendChange: ((newTVBudget - baselineMetrics.tv.spend) / baselineMetrics.tv.spend) * 100,
        atcChange: ((totalOptimizedTVATC - baselineMetrics.tv.atc) / baselineMetrics.tv.atc) * 100,
      },
      digital: {
        spend: newDigitalBudget + activeSyncBudget,
        atc: newDigitalATC,
        spendChange: (((newDigitalBudget + activeSyncBudget) - baselineMetrics.digital.spend) / baselineMetrics.digital.spend) * 100,
        atcChange: ((newDigitalATC - baselineMetrics.digital.atc) / baselineMetrics.digital.atc) * 100,
      },
      youtube: {
        spend: newYTBudget,
        atc: newYTATC,
        spendChange: ((newYTBudget - baselineMetrics.youtube.Spend) / baselineMetrics.youtube.Spend) * 100,
        atcChange: ((newYTATC - baselineMetrics.youtube.ATC) / baselineMetrics.youtube.ATC) * 100,
      },
      jiohotstar: {
        spend: newJHSBudget,
        atc: newJHSATC,
        spendChange: ((newJHSBudget - baselineMetrics.jiohotstar.Spend) / baselineMetrics.jiohotstar.Spend) * 100,
        atcChange: ((newJHSATC - baselineMetrics.jiohotstar.ATC) / baselineMetrics.jiohotstar.ATC) * 100,
      },
      sync: syncEnabled ? {
        spend: activeSyncBudget,
        atc: syncMetrics.atc,
        costPerATC: syncMetrics.costPerATC,
        share: (syncMetrics.atc / newDigitalATC) * 100,
      } : null,
      regions: optimizedRegions,
      channels: optimizedChannels,
      total: {
        spend: totalBudget,
        atc: newTotalATC,
        atcLift: ((newTotalATC - baselineMetrics.total.atc) / baselineMetrics.total.atc) * 100,
        atcGain: newTotalATC - baselineMetrics.total.atc,
      }
    }
  }, [hasOptimized, baselineMetrics, tvDigitalSplit, ytJhsSplit, tvIntensity, tvThreshold, syncEnabled, syncBudget])
}
