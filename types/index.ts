export interface DigitalPlatformData {
  Spend: number
  Impressions: number
  ATC: number
  Searches: number
  ReachPct: number
  Frequency: number
  CPM: number
}

export interface DigitalData {
  YouTube: DigitalPlatformData
  JioHotstar: DigitalPlatformData
}

export interface TVRegionalData {
  Spend: number
  ATC: number
  Channels: number
  ReachPct: number
}

export interface TVChannel {
  Channel: string
  Region: string
  Genre: string
  Spend: number
  ReachPct: number
  ATC: number
  ImpactScore: number
}

export interface OptimizedChannel extends TVChannel {
  newSpend?: number
  newATC?: number
  spendChange?: number
  atcChange?: number
  status?: 'INCREASE' | 'DECREASE' | 'MAINTAIN'
  threshold?: 'High' | 'Low'
}

export interface OptimizedRegion extends TVRegionalData {
  newSpend: number
  newATC: number
  spendChange: number
  atcChange: number
}

export interface BaselineMetrics {
  tv: { spend: number; atc: number }
  digital: { spend: number; atc: number }
  youtube: DigitalPlatformData
  jiohotstar: DigitalPlatformData
  total: { spend: number; atc: number }
  tvPct: number
  digitalPct: number
  ytPct: number
}

export interface SyncMetrics {
  spend: number
  atc: number
  costPerATC: number
  ytATC: number
  jhsATC: number
}

export interface OptimizedSync {
  spend: number
  atc: number
  costPerATC: number
  share: number
}

export interface OptimizedMetrics {
  tv: {
    spend: number
    atc: number
    spendChange: number
    atcChange: number
  }
  digital: {
    spend: number
    atc: number
    spendChange: number
    atcChange: number
  }
  youtube: {
    spend: number
    atc: number
    spendChange: number
    atcChange: number
  }
  jiohotstar: {
    spend: number
    atc: number
    spendChange: number
    atcChange: number
  }
  sync: OptimizedSync | null
  regions: Record<string, OptimizedRegion>
  channels: OptimizedChannel[]
  total: {
    spend: number
    atc: number
    atcLift: number
    atcGain: number
  }
}

export interface PieDataItem {
  name: string
  value: number
  color: string
}

export type TabId = 'summary' | 'digital' | 'tv'
export type RegionCode = 'HSM' | 'AP' | 'TN' | 'Kar' | 'Ker' | 'WB' | 'Sports' | 'Others'
export type SliderColor = 'orange' | 'cyan' | 'indigo' | 'emerald' | 'red' | 'blue'
